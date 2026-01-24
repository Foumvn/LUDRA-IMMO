import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from config import Config
from services.firebase_service import get_db
from services.user_service import UserService
from models.user import User

class AuthService:
    """Service pour gérer l'authentification JWT"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash un mot de passe avec bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        """Vérifie un mot de passe contre son hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    @staticmethod
    def generate_token(user_id: str, email: str, role: str) -> str:
        """
        Génère un token JWT pour un utilisateur
        
        Args:
            user_id: ID de l'utilisateur
            email: Email de l'utilisateur
            role: Rôle de l'utilisateur
        
        Returns:
            Token JWT encodé
        """
        payload = {
            'user_id': user_id,
            'email': email,
            'role': role,
            'exp': datetime.now(timezone.utc) + timedelta(seconds=Config.JWT_EXPIRATION_DELTA),
            'iat': datetime.now(timezone.utc)
        }
        token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)
        return token
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Vérifie et décode un token JWT
        
        Args:
            token: Token JWT à vérifier
        
        Returns:
            Payload décodé ou None si invalide
        """
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def register(email: str, password: str, name: str, phone: str, city: str, role: str = "user") -> Dict[str, Any]:
        """
        Enregistre un nouvel utilisateur
        
        Args:
            email: Email de l'utilisateur
            password: Mot de passe en clair
            name: Nom de l'utilisateur
            phone: Téléphone de l'utilisateur
            city: Ville de l'utilisateur
            role: Rôle de l'utilisateur (user, owner, admin)
        
        Returns:
            Dictionnaire avec user et token, ou erreur
        """
        db = get_db()
        
        # Vérifier si l'email existe déjà
        users_ref = db.collection('users')
        existing_user = users_ref.where('email', '==', email).get()
        
        if existing_user:
            raise ValueError("Un utilisateur avec cet email existe déjà")
        
        # Générer un UID unique (on peut utiliser l'email comme base ou générer un UUID)
        import uuid
        uid = str(uuid.uuid4())
        
        # Hasher le mot de passe
        password_hash = AuthService.hash_password(password)
        
        # Créer l'utilisateur
        user_data = {
            'uid': uid,
            'name': name,
            'email': email,
            'phone': phone,
            'city': city,
            'role': role,
            'emailVerified': False,
            'phoneVerified': False,
            'status': 'active',
            'favorites': [],
            'preferences': {
                'notifications': True,
                'newsletter': False
            },
            'passwordHash': password_hash,  # Stocker le hash, pas le mot de passe
            'createdAt': datetime.now(timezone.utc).isoformat(),
            'updatedAt': datetime.now(timezone.utc).isoformat()
        }
        
        # Ajouter à Firestore
        db.collection('users').document(uid).set(user_data)
        
        # Créer l'objet User (sans le password hash)
        user_dict = user_data.copy()
        user_dict.pop('passwordHash', None)
        user = User.from_dict(user_dict)
        
        # Générer le token
        token = AuthService.generate_token(uid, email, role)
        
        return {
            'user': user.to_dict(),
            'token': token
        }
    
    @staticmethod
    def login(email: str, password: str) -> Dict[str, Any]:
        """
        Connecte un utilisateur
        
        Args:
            email: Email de l'utilisateur
            password: Mot de passe en clair
        
        Returns:
            Dictionnaire avec user et token, ou erreur
        """
        db = get_db()
        
        # Trouver l'utilisateur par email
        users_ref = db.collection('users')
        user_docs = users_ref.where('email', '==', email).get()
        
        if not user_docs:
            raise ValueError("Email ou mot de passe incorrect")
        
        user_doc = user_docs[0]
        user_data = user_doc.to_dict()
        user_data['uid'] = user_doc.id
        
        # Vérifier le mot de passe
        password_hash = user_data.get('passwordHash')
        if not password_hash:
            raise ValueError("Compte utilisateur invalide")
        
        if not AuthService.verify_password(password, password_hash):
            raise ValueError("Email ou mot de passe incorrect")
        
        # Vérifier le statut
        if user_data.get('status') != 'active':
            raise ValueError("Compte désactivé ou banni")
        
        # Créer l'objet User (sans le password hash)
        user_dict = user_data.copy()
        user_dict.pop('passwordHash', None)
        user = User.from_dict(user_dict)
        
        # Générer le token
        token = AuthService.generate_token(user.uid, user.email, user.role)
        
        return {
            'user': user.to_dict(),
            'token': token
        }
    
    @staticmethod
    def get_current_user(token: str) -> Optional[User]:
        """
        Récupère l'utilisateur actuel à partir du token
        
        Args:
            token: Token JWT
        
        Returns:
            Objet User ou None
        """
        payload = AuthService.verify_token(token)
        if not payload:
            return None
        
        user_id = payload.get('user_id')
        if not user_id:
            return None
        
        return UserService.get_user(user_id)
    
    @staticmethod
    def change_password(user_id: str, old_password: str, new_password: str) -> bool:
        """
        Change le mot de passe d'un utilisateur
        
        Args:
            user_id: ID de l'utilisateur
            old_password: Ancien mot de passe
            new_password: Nouveau mot de passe
        
        Returns:
            True si succès, False sinon
        """
        db = get_db()
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise ValueError("Utilisateur non trouvé")
        
        user_data = user_doc.to_dict()
        password_hash = user_data.get('passwordHash')
        
        if not password_hash:
            raise ValueError("Compte utilisateur invalide")
        
        # Vérifier l'ancien mot de passe
        if not AuthService.verify_password(old_password, password_hash):
            raise ValueError("Ancien mot de passe incorrect")
        
        # Hasher le nouveau mot de passe
        new_password_hash = AuthService.hash_password(new_password)
        
        # Mettre à jour
        user_ref.update({
            'passwordHash': new_password_hash,
            'updatedAt': datetime.now(timezone.utc).isoformat()
        })
        
        return True

