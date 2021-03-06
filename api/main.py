
import datetime
from flask.sessions import SecureCookieSessionInterface
from flask import g
from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
import uuid
import os
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from google.oauth2 import id_token
from google.auth.transport import requests
from flask_cors import CORS
from google.cloud import storage

app = Flask(__name__, static_folder="build", static_url_path="/")
app.config.update(
    DEBUG=True,
    SECRET_KEY="FARTSSADASDASDASDASDASDASDASD",
    SESSION_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Strict",
    SQLALCHEMY_DATABASE_URI="mysql+pymysql://root:ZaidBen123@/image_sharing_db?unix_socket=/cloudsql/imagehosting-331720:europe-west1:image-sharing-db"
)

cors = CORS(app)
db = SQLAlchemy(app)

from query import db_add_image, db_delete_albums, db_add_user, db_add_image, db_delete_images, db_get_all_images_from_album, db_get_n_recent_images, db_get_image_by_user_id, db_get_user_by_id, db_get_user_by_sub, db_add_user_without_family, db_get_image_by_hash, db_new_album_multiple_images, db_get_albums_by_user_id, db_get_first_image_from_album

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


@login_manager.user_loader
def load_user(id):
    return db_get_user_by_id(id)


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
            user_query = db_get_user_by_sub(idinfo['sub'])
            if user_query:
                login_user(user_query)
                print(user_query, " logged in (already exists)")
                return {'login': 'True'}
            else:
                if "family_name" in idinfo:
                    user = db_add_user(idinfo['sub'], idinfo['email'], idinfo['picture'],
                                       idinfo['given_name'], idinfo['family_name'])
                else:
                    user = db_add_user_without_family(idinfo['sub'], idinfo['email'], idinfo['picture'],
                                                      idinfo['given_name'])
                login_user(user)
                print(user_query, " logged in (new acct created)")
                return {'login': 'True'}
    except ValueError as e:
        print(e)
        return {'login': "Failed to validate token"}, 401


@app.route("/api/data", methods=["GET"])
@login_required
def user_data():
    return current_user.as_dict()


@app.route('/api/image/new', methods=['POST'])
@login_required
def upload_image():
    # TODO: Add restricted image file types.
    """Process the uploaded file and upload it to Google Cloud Storage."""
    uploaded_file = request.files.get('image')
    uploaded_caption = request.form.get('caption')
    public = request.form.get('public')

    if not uploaded_file:
        return 'No file uploaded.', 400
    if not public:
        return 'Not specified whether public or private.', 400

    # Create a Cloud Storage client.
    _, extension = os.path.splitext(uploaded_file.filename)
    rand_string = str(uuid.uuid4())
    filename = rand_string + extension
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "service_account.json"
    gcs = storage.Client()

    # Get the bucket that the file will be uploaded to.

    bucket = gcs.get_bucket("imagehosting-331720.appspot.com")

    # Create a new blob and upload the file's content.
    blob = bucket.blob(filename)

    blob.upload_from_string(
        uploaded_file.read(),
        content_type=uploaded_file.content_type
    )
    blob.make_public()

    db_resp = db_add_image(current_user.id, filename,
                           datetime.datetime.now(), uploaded_caption, public)
    if db_resp:
        return {"success": "Successfully uploaded image", "img_hash": filename}
    else:
        return {"error": "Was not able to upload image"}, 401


@app.route("/api/image/recent")
def recent_images():
    query = db_get_n_recent_images(9)
    def full_name(user): return user.given_name + " " + user.family_name

    if query:
        return {"images": [{**img.as_dict(), **{"user_full_name": full_name(db_get_user_by_id(img.user_id))}} for img in query]}
    else:
        return {"error": "Failed to retrieve recent images."}, 403


@app.route("/api/image/", methods=["POST"])
def image_by_hash():
    if request.form.get('hash'):
        img = db_get_image_by_hash(request.form.get('hash'))
        def full_name(user): return user.given_name + " " + user.family_name

        if img:
            return {"image": {**img.as_dict(), **{"user_full_name": full_name(db_get_user_by_id(img.user_id))}}}
        else:
            return {"error": "Failed to retrieve image " + request.form.get('hash')}, 401
    else:
        return {"error": "No hash provided"}, 400


@app.route("/api/image/delete", methods=["POST"])
def delete_image():
    print(request.form.get('images'))
    if request.form.get('images') is not None:
        img = db_delete_images(request.form.get('images').split(","))

        if img:
            return {"image": "Successfully deleted."}
        else:
            return {"error": "Failed to retrieve image "}, 401
    else:
        return {"error": "No image id provided"}, 400


@app.route("/api/album/delete", methods=["POST"])
def delete_album():
    print(request.form.get('album'))
    if request.form.get('albums') is not None:
        img = db_delete_albums(request.form.get('albums').split(","))

        if img:
            return {"album": "Successfully deleted."}
        else:
            return {"error": "Failed to retrieve image "}, 401
    else:
        return {"error": "No album id provided"}, 400


@app.route("/api/image/user")
@login_required
def current_user_images():
    query = db_get_image_by_user_id(current_user.id)

    if query:
        return {"images": [img.as_dict() for img in query]}
    else:
        return {"error": "Failed to retrieve users images."}, 403


@app.route("/api/album/previews")
@login_required
def preview_album():
    query = db_get_albums_by_user_id(current_user.id)

    if query is not None:
        def get_preview_image(album_id):
            get_image = db_get_first_image_from_album(album_id)
            if get_image is None:
                return None
            else:
                return get_image.image

        albums = []
        for album in query:
            preview_img = get_preview_image(album.id)

            if preview_img is not None:
                albums.append(
                    {**album.as_dict(), **{"image": get_preview_image(album.id)}})
            else:
                albums = []
                albums.append(album.as_dict())
        return {"albums": albums}
                     
    else:
        return {"error": "Failed to retrieve albums"}, 403


@app.route("/api/album", methods=["POST"])
@login_required
def get_images_from_album():
    album_id = request.form.get('album_id')
    query = db_get_all_images_from_album(album_id)

    if query is not None:
        return {"album_id": album_id, "images": [img.as_dict() for img in query]}
    else:
        return {"error": "Failed to retrieve images from album"}, 403


@app.route("/api/album/create", methods=["POST"])
@login_required
def create_album():
    images = request.form.get('images')
    album_title = request.form.get('album_title')
    if not images or not album_title:
        return {"error": "Missing an entry to create a form."}, 400
    new_album = db_new_album_multiple_images(
        album_title, current_user.id, images.split(","))
    print("main", images)
    if new_album is not None:
        return new_album.as_dict()
    else:
        return {"error": "Failed to create album."}, 403


@app.route("/api/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"logout": True})


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(8080))
