import firebase_admin
from firebase_admin import credentials, firestore, storage
from config import Config
import os

# Variables globales pour les instances Firebase
db = None
bucket = None

def initialize_firebase():
    """Initialise Firebase Admin SDK"""
    global db, bucket
    
    if not firebase_admin._apps:
        if Config.FIREBASE_CREDENTIALS_PATH and os.path.exists(Config.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(Config.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred, {
                'storageBucket': Config.FIREBASE_STORAGE_BUCKET
            })
        else:
            # Pour le développement, on peut utiliser les credentials par défaut
            # ou les variables d'environnement
            firebase_admin.initialize_app()
    
    db = firestore.client()
    bucket = storage.bucket(Config.FIREBASE_STORAGE_BUCKET) if Config.FIREBASE_STORAGE_BUCKET else None
    
    return db, bucket

def get_db():
    """Retourne l'instance Firestore"""
    if db is None:
        initialize_firebase()
    return db

def get_storage():
    """Retourne l'instance Storage"""
    if bucket is None:
        initialize_firebase()
    return bucket

