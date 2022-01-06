from models import User, Image, Album

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

import datetime
from sqlalchemy import desc
from sqlalchemy import exc

from main import db


def db_commit_add(row):
    db.session.add(row)
    db.session.commit()


def db_commit_delete(row):
    db.session.delete(row)
    db.session.commit()


def db_add_user(sub, email, picture, given_name, family_name):
    user = User(sub=sub, email=email, picture=picture,
                given_name=given_name, family_name=family_name)
    db.session.add(user)
    db.session.commit()
    return user


def db_add_user_without_family(sub, email, picture, given_name):
    user = User(sub=sub, email=email, picture=picture,
                given_name=given_name)
    db.session.add(user)
    db.session.commit()
    return user


def db_add_image(user_id, image, date_uploaded, caption, public):
    try:
        if caption == "undefined":
            image = Image(user_id=user_id, image=image,
                          date_uploaded=date_uploaded, caption="", public=public)
        else:
            image = Image(user_id=user_id, image=image,
                          date_uploaded=date_uploaded, caption=caption, public=public)
        db.session.add(image)
        db.session.commit()
    except exc.SQLAlchemyError as e:
        print(e)
        return False
    else:
        return True


def db_new_album_multiple_images(album_title, user_id, list_of_image_ids):
    try:
        print("query", list_of_image_ids)
        new_album = Album(title=album_title, user_id=user_id,
                          date_created=datetime.datetime.now())
        images = Image.query.filter(Image.id.in_(list_of_image_ids)).all()
        new_album.images = [x for x in images]
        db.session.add(new_album)
        db.session.commit()
        return new_album
    except exc.SQLAlchemyError as e:
        print(e)
        db.session.rollback()
        return None


def db_add_album(title, user_id, image_id=0, date_created=datetime.datetime.now()):
    try:
        album = Album(title=title, image_id=image_id,
                      user_id=user_id, date_created=date_created)
        db.session.add(album)
        db.session.commit()
        return album
    except exc.SQLAlchemyError as e:
        db.session.rollback()
        return False
    else:
        return True


def db_delete_user(user_id):
    try:
        User.query.filter_by(id=user_id).delete()
        db.session.commit()
    except exc.SQLAlchemyError as e:
        db.session.rollback()
        return False
    else:
        return True


def db_delete_image(image_id):
    try:
        Image.query.filter_by(id=image_id).delete()
        db.session.commit()
    except exc.SQLAlchemyError as e:
        db.session.rollback()
        return False
    else:
        return True


def db_delete_images(list_of_image_ids):
    try:
        images = Image.query.filter(Image.id.in_(list_of_image_ids))
        images.delete(synchronize_session=False)
        db.session.commit()
        return True
    except exc.SQLAlchemyError as e:
        print(e)
        db.session.rollback()
        return None


def db_delete_albums(list_of_album_ids):
    try:
        albums = Album.query.filter(Album.id.in_(list_of_album_ids))
        albums.delete(synchronize_session=False)
        db.session.commit()
        return True
    except exc.SQLAlchemyError as e:
        print(e)
        db.session.rollback()
        return None


def db_delete_album(album_id):
    try:
        Album.query.filter_by(id=album_id).delete()
        db.session.commit()
    except exc.SQLAlchemyError as e:
        db.session.rollback()
        return False
    else:
        return True

# search for a user in the User table by id


def db_get_user_by_id(user_id):
    try:
        user = User.query.filter_by(id=user_id).first()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return user

# search for an image in the Image table by id


def db_get_image_by_id(image_id):
    try:
        image = Image.query.filter_by(id=image_id).first()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return image


def db_get_image_by_hash(hash):
    try:
        image = Image.query.filter_by(image=hash).first()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return image

# search for an album in the Album table by id


def db_get_album_by_id(album_id):
    try:
        album = Album.query.filter_by(id=album_id).first()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return album


# search for a user in the User table by email
def db_get_user_by_email(email):
    try:
        user = User.query.filter_by(email=email).first()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return user

# search for a user by their name


def db_get_user_by_name(firstname, surname):
    try:
        user = User.query.filter_by(
            given_name=firstname, family_name=surname).first()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return user


def db_get_user_by_sub(sub):
    try:
        user = User.query.filter_by(
            sub=sub).first()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return user

# search for all images from a specific user id


def db_get_image_by_user_id(user_id):
    try:
        image = Image.query.filter_by(user_id=user_id).order_by(
            desc(Image.date_uploaded)).all()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return image

# search for the n most recent images from all users


def db_get_n_recent_images(n):
    try:
        image = Image.query.filter_by(public=1).order_by(desc(Image.date_uploaded)).limit(n).all()
    except exc.SQLAlchemyError as e:
        return False
    else:
        return image

# search for all albums from a specific user id

# get first image from a specific album_id


def db_get_first_image_from_album(album_id):
    try:
        image = Image.query.filter(Image.albums.any(id=album_id)).first()
        return image
    except exc.SQLAlchemyError as e:
        print(e)
        return None


def db_get_albums_by_user_id(user_id):
    try:
        album = Album.query.filter_by(user_id=user_id).order_by(
            desc(Album.date_created)).all()
        return album
    except exc.SQLAlchemyError as e:
        return None

# search for albums that contain a specific image id


def db_get_album_by_image_id(image_id):
    try:
        album = Album.query.filter_by(image_id=image_id).all()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return album

# search for user's n most recent albums (default 50 if not specified)


def db_get_users_n_recent_albums(user_id, n=50):
    try:
        album = Album.query.filter_by(user_id=user_id).order_by(
            desc(Album.date_created)).limit(n).all()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return album

# search for albums by title


def db_get_album_by_title(title):
    try:
        album = Album.query.filter_by(title=title).first()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return album

# get all images from a specific album_id


def db_get_all_images_from_album(album_id):
    try:
        image = Image.query.filter(Image.albums.any(id=album_id)).all()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return image

# get all albums from a specific image_id (all albums that the image is in)


def db_get_all_albums_from_images(image_id):
    try:
        album = Album.query.filter(Album.images.any(id=image_id)).all()
    except exc.SQLAlchemyError as e:
        return None
    else:
        return album

# add to the album_image table


def db_add_album_image(album_id, image_id):
    try:
        image = Image.query.filter(Image.id == image_id).first()
        album = Album.query.filter(Album.id == album_id).first()
        album.images.append(image)
        db.session.add(album)
        db.session.commit()
    except exc.SQLAlchemyError as e:
        db.session.rollback()
        return False
    else:
        return True
