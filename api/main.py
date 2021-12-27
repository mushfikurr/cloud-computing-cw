from flask.sessions import SecureCookieSessionInterface
from flask import g
from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
import uuid
import os
import datetime
from flask_login import (
    LoginManager,
    UserMixin,
    current_user,
    login_required,
    login_user,
    logout_user,
)
# Move to GOOGLE CLOUD STORAGE PYTHON library
from google.oauth2 import id_token
from google.auth.transport import requests
from flask_cors import CORS
from google.cloud import storage


app = Flask(__name__, static_folder="build", static_url_path="/")
app.config.update(
    DEBUG=True,
    SECRET_KEY=os.environ.get("FN_FLASK_SECRET_KEY"),
    SESSION_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Strict",
    SQLALCHEMY_DATABASE_URI="mysql+pymysql://root:ZaidBen123@localhost:3306/image_sharing_db"
)

cors = CORS(app)
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "strong"


class CustomSessionInterface(SecureCookieSessionInterface):
    """Prevent creating session from API requests."""

    def save_session(self, *args, **kwargs):
        if g.get('login_via_header'):
            return
        return super(CustomSessionInterface, self).save_session(*args,
                                                                **kwargs)


app.session_interface = CustomSessionInterface()


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    sub = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(80), unique=True)
    picture = db.Column(db.String(200), nullable=True)
    given_name = db.Column(db.String(80))
    family_name = db.Column(db.String(80))

    user_image = db.relationship("Image", primaryjoin="User.id==Image.user_id")
    user_album = db.relationship("Album", primaryjoin="User.id==Album.user_id")

    def __repr__(self):
        return f'User ({self.id} {self.sub})'


class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    album_id = db.Column(db.Integer, db.ForeignKey('album.id'), nullable=False)
    date_uploaded = db.Column(db.DateTime, nullable=False)
    caption = db.Column(db.String(150))
    image = db.Column(db.String(150))
    image_album = db.relationship(
        "Album", primaryjoin="Image.id==Album.image_id")

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Album(db.Model):
    __tablename__ = 'album'
    id = db.Column(db.Integer, primary_key=True)
    image_id = db.Column(db.Integer, db.ForeignKey('image.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(50))
    date_created = db.Column(db.DateTime, nullable=False)
    album_image = db.relationship(
        "Image", primaryjoin="Album.id==Image.album_id")

    def __repr__(self):
        return '<id {}>'.format(self.id)


def get_user(sub: int):
    query = User.query.filter_by(sub=sub).first()
    if query:
        return query
    return None


@login_manager.user_loader
def load_user(id):
    return User.query.filter_by(id=id).first()


def attempt_token_verification():
    try:
        token = request.headers.get('Authorization')
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), '1084294817544-vcbqovejip9q2drlfaoke9kr6je0akqj.apps.googleusercontent.com')
        if idinfo['sub']:
            user_query = get_user(idinfo['sub'])
            if user_query:
                print(user_query, " verified via request (already exists)")
                return user_query
            else:
                print("Failed login (acct does not exist)")
                return None
        else:
            return {"error": "This was not a valid token."}
    except ValueError:
        return {'error': 'Failed in verifying token'}


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/api/login", methods=["POST"])
def login():
    try:
        token = request.form['token_id']
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), '1084294817544-vcbqovejip9q2drlfaoke9kr6je0akqj.apps.googleusercontent.com')
        if idinfo['sub']:
            user_query = get_user(idinfo['sub'])
            if user_query:
                login_user(user_query)
                print(user_query, " logged in (already exists)")
                return {'login': 'True'}
            else:
                new_user = User(sub=idinfo['sub'], email=idinfo['email'], picture=idinfo['picture'],
                                given_name=idinfo['given_name'], family_name=idinfo['family_name'])
                db.session.add(new_user)
                db.session.commit()
                login_user(new_user)
                print(user_query, " logged in (new acct created)")
                return {'login': 'True'}
    except ValueError as e:
        print(e)
        return {'login': 'False'}


@app.route("/api/data", methods=["GET"])
@login_required
def user_data():
    return {
        "id": current_user.id,
        "email": current_user.email,
        "picture": current_user.picture,
        "given_name": current_user.given_name,
        "family_name": current_user.family_name
    }


IMAGE_MIME_TYPES = {
    'image/jpeg',
    'image/png'
}


@app.route('/api/image/new', methods=['POST'])
@login_required
def upload_image():
    """Process the uploaded file and upload it to Google Cloud Storage."""
    uploaded_file = request.files.get('image')
    uploaded_caption = request.form.get('caption')

    if not uploaded_file:
        return 'No file uploaded.', 400

    # Create a Cloud Storage client.
    _, extension = os.path.splitext(uploaded_file.filename)
    filename = str(uuid.uuid4()) + extension
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "service_account.json"
    gcs = storage.Client()

    # Get the bucket that the file will be uploaded to.
    bucket = gcs.get_bucket(os.environ.get("GOOGLE_CLOUD_STORAGE_BUCKET"))

    # Create a new blob and upload the file's content.
    blob = bucket.blob(filename)

    blob.upload_from_string(
        uploaded_file.read(),
        content_type=uploaded_file.content_type
    )
    blob.make_public()

    new_image = Image(user_id=current_user.id,
                      date_uploaded=datetime.datetime.now(), image=blob.public_url, caption=uploaded_caption)
    db.session.add(new_image)
    db.session.commit()
    return {"success": "Successfully uploaded image"}


@app.route("/api/image/recent")
def recent_images():
    from sqlalchemy import desc
    query = Image.query.order_by(desc(Image.date_uploaded)).limit(10).all()

    def full_name(user): return user.given_name + " " + user.family_name

    if query:
        return {"images": [{**img.as_dict(), **{"user_full_name": full_name(User.query.filter_by(id=img.user_id).first())}} for img in query]}
    else:
        return {"error": ""}


@app.route("/api/image/user")
@login_required
def recent_images():
    from sqlalchemy import desc
    query = Image.query.filter_by(user_id=current_user.id).all()

    if query:
        return {"images": [img.as_dict() for img in query]}
    else:
        return {"error": ""}


@app.route("/api/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"logout": True})
