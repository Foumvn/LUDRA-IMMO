from services.firebase_service import get_storage
from werkzeug.utils import secure_filename
import uuid
from typing import List
from flask import request
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
def allowed_file(filename: str) -> bool:
    """Vérifie si le fichier a une extension autorisée"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
def upload_images(images: List, property_id: str) -> List[str]:
    """
    Upload des images vers Firebase Storage
    Args:
        images: Liste de fichiers d'images
        property_id: ID de la propriété
    Returns:
        Liste des URLs des images uploadées
    """
    bucket = get_storage()
    if bucket is None:
        raise Exception("Firebase Storage n'est pas initialisé")
    image_urls = []
    for image in images:
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            unique_filename = f"{property_id}/{uuid.uuid4()}_{filename}"
            blob = bucket.blob(unique_filename)
            blob.upload_from_file(image, content_type=image.content_type)
            blob.make_public()
            image_urls.append(blob.public_url)
    return image_urls
def delete_images(image_urls: List[str]):
    """
    Supprime des images de Firebase Storage
    Args:
        image_urls: Liste des URLs des images à supprimer
    """
    bucket = get_storage()
    if bucket is None:
        return
    from urllib.parse import unquote
    for url in image_urls:
        try:
            if '/o/' in url:
                path_part = url.split('/o/')[1].split('?')[0]
                blob_path = unquote(path_part)
                blob = bucket.blob(blob_path)
                if blob.exists():
                    blob.delete()
            else:
                filename = url.split('/')[-1].split('?')[0]
                blobs = bucket.list_blobs(prefix=filename)
                for blob in blobs:
                    if blob.public_url == url or filename in blob.name:
                        blob.delete()
                        break
        except Exception as e:
            print(f"Erreur lors de la suppression de l'image {url}: {e}")
