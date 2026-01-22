from datetime import datetime, timezone
from typing import Optional, Dict, Any

class Favorite:
    """Modèle favori"""
    
    def __init__(
        self,
        id: Optional[str],
        user_id: str,
        property_id: str,
        created_at: Optional[datetime] = None
    ):
        self.id = id
        self.user_id = user_id
        self.property_id = property_id
        self.created_at = created_at or datetime.now(timezone.utc)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convertit l'objet Favorite en dictionnaire"""
        return {
            "id": self.id,
            "userId": self.user_id,
            "propertyId": self.property_id,
            "createdAt": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any], doc_id: Optional[str] = None) -> 'Favorite':
        """Crée un objet Favorite à partir d'un dictionnaire"""
        return cls(
            id=doc_id or data.get("id"),
            user_id=data.get("userId", ""),
            property_id=data.get("propertyId", ""),
            created_at=datetime.fromisoformat(data["createdAt"]) if isinstance(data.get("createdAt"), str) else data.get("createdAt")
        )

