from services.firebase_service import get_db
from models.user import User
from datetime import datetime, timezone
from typing import Optional, Dict, Any

class UserService:
    """Service pour gérer les utilisateurs"""
    
    @staticmethod
    def create_user(user_data: Dict[str, Any]) -> User:
        """Crée un nouvel utilisateur"""
        db = get_db()
        
        user = User.from_dict(user_data)
        user.created_at = datetime.now(timezone.utc)
        user.updated_at = datetime.now(timezone.utc)
        
        user_dict = user.to_dict()
        user_dict.pop('uid', None)  # L'uid sera l'ID du document
        
        # Créer le document dans Firestore avec l'uid comme ID
        db.collection('users').document(user.uid).set(user_dict)
        
        return user
    
    @staticmethod
    def get_user(uid: str) -> Optional[User]:
        """Récupère un utilisateur par son UID"""
        db = get_db()
        doc = db.collection('users').document(uid).get()
        
        if doc.exists:
            data = doc.to_dict()
            data['uid'] = doc.id
            return User.from_dict(data)
        return None
    
    @staticmethod
    def update_user(uid: str, updates: Dict[str, Any]) -> Optional[User]:
        """Met à jour un utilisateur"""
        db = get_db()
        doc_ref = db.collection('users').document(uid)
        
        if not doc_ref.get().exists:
            return None
        
        updates['updatedAt'] = datetime.now(timezone.utc).isoformat()
        doc_ref.update(updates)
        
        return UserService.get_user(uid)
    
    @staticmethod
    def delete_user(uid: str) -> bool:
        """Supprime un utilisateur"""
        db = get_db()
        doc_ref = db.collection('users').document(uid)
        
        if not doc_ref.get().exists:
            return False
        
        # Supprimer aussi les favoris de l'utilisateur
        favorites = db.collection('favorites').where('userId', '==', uid).get()
        for fav in favorites:
            fav.reference.delete()
        
        # Supprimer l'utilisateur
        doc_ref.delete()
        
        return True
    
    @staticmethod
    def get_all_users(limit: int = 50, offset: int = 0) -> list:
        """Récupère tous les utilisateurs"""
        db = get_db()
        docs = db.collection('users').limit(limit).offset(offset).get()
        
        users = []
        for doc in docs:
            data = doc.to_dict()
            data['uid'] = doc.id
            users.append(User.from_dict(data))
        
        return users

