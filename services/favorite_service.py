from services.firebase_service import get_db
from models.favorite import Favorite
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
class FavoriteService:
    """Service pour gérer les favoris"""
    @staticmethod
    def add_favorite(user_id: str, property_id: str) -> Favorite:
        """Ajoute une propriété aux favoris d'un utilisateur"""
        db = get_db()
        existing = db.collection('favorites').where('userId', '==', user_id).where('propertyId', '==', property_id).get()
        if existing:
            doc = existing[0]
            return Favorite.from_dict(doc.to_dict(), doc.id)
        favorite = Favorite(
            id=None,
            user_id=user_id,
            property_id=property_id,
            created_at=datetime.now(timezone.utc)
        )
        favorite_dict = favorite.to_dict()
        favorite_dict.pop('id', None)
        doc_ref = db.collection('favorites').add(favorite_dict)
        favorite.id = doc_ref[1].id
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            favorites_list = user_data.get('favorites', [])
            if property_id not in favorites_list:
                favorites_list.append(property_id)
                user_ref.update({'favorites': favorites_list})
        return favorite
    @staticmethod
    def remove_favorite(user_id: str, property_id: str) -> bool:
        """Retire une propriété des favoris d'un utilisateur"""
        db = get_db()
        favorites = db.collection('favorites').where('userId', '==', user_id).where('propertyId', '==', property_id).get()
        if not favorites:
            return False
        for fav in favorites:
            fav.reference.delete()
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            favorites_list = user_data.get('favorites', [])
            if property_id in favorites_list:
                favorites_list.remove(property_id)
                user_ref.update({'favorites': favorites_list})
        return True
    @staticmethod
    def get_user_favorites(user_id: str) -> List[Favorite]:
        """Récupère tous les favoris d'un utilisateur"""
        db = get_db()
        docs = db.collection('favorites').where('userId', '==', user_id).get()
        favorites = []
        for doc in docs:
            favorites.append(Favorite.from_dict(doc.to_dict(), doc.id))
        return favorites
    @staticmethod
    def is_favorite(user_id: str, property_id: str) -> bool:
        """Vérifie si une propriété est dans les favoris d'un utilisateur"""
        db = get_db()
        docs = db.collection('favorites').where('userId', '==', user_id).where('propertyId', '==', property_id).get()
        return len(docs) > 0
