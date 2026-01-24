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
            # Générer un nom de fichier unique
            filename = secure_filename(image.filename)
            unique_filename = f"{property_id}/{uuid.uuid4()}_{filename}"
            
            # Créer un blob et uploader
            blob = bucket.blob(unique_filename)
            blob.upload_from_file(image, content_type=image.content_type)
            
            # Rendre le fichier public et obtenir l'URL
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
            # Format Firebase Storage: https://firebasestorage.googleapis.com/v0/b/BUCKET/o/PATH%2FTO%2FFILE?alt=media&token=...
            if '/o/' in url:
                # Extraire le chemin après /o/
                path_part = url.split('/o/')[1].split('?')[0]
                # Décoder l'URL (remplacer %2F par /, etc.)
                blob_path = unquote(path_part)
                blob = bucket.blob(blob_path)
                if blob.exists():
                    blob.delete()
            else:
                # Si c'est une URL publique directe, essayer d'extraire le nom du fichier
                # et chercher dans le bucket
                filename = url.split('/')[-1].split('?')[0]
                # Chercher le blob par nom (moins fiable)
                blobs = bucket.list_blobs(prefix=filename)
                for blob in blobs:
                    if blob.public_url == url or filename in blob.name:
                        blob.delete()
                        break
        except Exception as e:
            print(f"Erreur lors de la suppression de l'image {url}: {e}")

