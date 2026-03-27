from datetime import datetime, timezone
from typing import Optional, Dict, Any
class User:
    """Modèle utilisateur"""
    def __init__(
        self,
        uid: str,
        name: str,
        email: str,
        phone: str,
        city: str,
        role: str = "user",
        email_verified: bool = False,
        phone_verified: bool = False,
        avatar: Optional[str] = None,
        favorites: Optional[list] = None,
        status: str = "active",
        preferences: Optional[Dict[str, bool]] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.uid = uid
        self.name = name
        self.email = email
        self.phone = phone
        self.city = city
        self.role = role
        self.email_verified = email_verified
        self.phone_verified = phone_verified
        self.avatar = avatar
        self.favorites = favorites or []
        self.status = status
        self.preferences = preferences or {"notifications": True, "newsletter": False}
        self.created_at = created_at or datetime.now(timezone.utc)
        self.updated_at = updated_at or datetime.now(timezone.utc)
    def to_dict(self) -> Dict[str, Any]:
        """Convertit l'objet User en dictionnaire"""
        return {
            "uid": self.uid,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "city": self.city,
            "role": self.role,
            "emailVerified": self.email_verified,
            "phoneVerified": self.phone_verified,
            "avatar": self.avatar,
            "favorites": self.favorites,
            "status": self.status,
            "preferences": self.preferences,
            "createdAt": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at,
            "updatedAt": self.updated_at.isoformat() if isinstance(self.updated_at, datetime) else self.updated_at
        }
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        """Crée un objet User à partir d'un dictionnaire"""
        return cls(
            uid=data.get("uid", ""),
            name=data.get("name", ""),
            email=data.get("email", ""),
            phone=data.get("phone", ""),
            city=data.get("city", ""),
            role=data.get("role", "user"),
            email_verified=data.get("emailVerified", False),
            phone_verified=data.get("phoneVerified", False),
            avatar=data.get("avatar"),
            favorites=data.get("favorites", []),
            status=data.get("status", "active"),
            preferences=data.get("preferences", {"notifications": True, "newsletter": False}),
            created_at=datetime.fromisoformat(data["createdAt"]) if isinstance(data.get("createdAt"), str) else data.get("createdAt"),
            updated_at=datetime.fromisoformat(data["updatedAt"]) if isinstance(data.get("updatedAt"), str) else data.get("updatedAt")
        )
