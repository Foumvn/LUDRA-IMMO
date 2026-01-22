from datetime import datetime, timezone
from typing import Optional, Dict, Any, List

class Property:
    """Modèle propriété"""
    
    def __init__(
        self,
        id: Optional[str],
        owner_id: str,
        title: str,
        description: str,
        type: str,
        price: float,
        rooms: int,
        bathrooms: int,
        surface: float,
        region: str,
        city: str,
        address: str,
        coordinates: Optional[Dict[str, float]] = None,
        status: str = "available",
        images: Optional[List[str]] = None,
        features: Optional[List[str]] = None,
        is_featured: bool = False,
        is_premium: bool = False,
        visits: int = 0,
        contact_requests: int = 0,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = id
        self.owner_id = owner_id
        self.title = title
        self.description = description
        self.type = type
        self.price = price
        self.rooms = rooms
        self.bathrooms = bathrooms
        self.surface = surface
        self.region = region
        self.city = city
        self.address = address
        self.coordinates = coordinates or {}
        self.status = status
        self.images = images or []
        self.features = features or []
        self.is_featured = is_featured
        self.is_premium = is_premium
        self.visits = visits
        self.contact_requests = contact_requests
        self.created_at = created_at or datetime.now(timezone.utc)
        self.updated_at = updated_at or datetime.now(timezone.utc)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convertit l'objet Property en dictionnaire"""
        return {
            "id": self.id,
            "ownerId": self.owner_id,
            "title": self.title,
            "description": self.description,
            "type": self.type,
            "price": self.price,
            "rooms": self.rooms,
            "bathrooms": self.bathrooms,
            "surface": self.surface,
            "region": self.region,
            "city": self.city,
            "address": self.address,
            "coordinates": self.coordinates,
            "status": self.status,
            "images": self.images,
            "features": self.features,
            "isFeatured": self.is_featured,
            "isPremium": self.is_premium,
            "visits": self.visits,
            "contactRequests": self.contact_requests,
            "createdAt": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at,
            "updatedAt": self.updated_at.isoformat() if isinstance(self.updated_at, datetime) else self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any], doc_id: Optional[str] = None) -> 'Property':
        """Crée un objet Property à partir d'un dictionnaire"""
        return cls(
            id=doc_id or data.get("id"),
            owner_id=data.get("ownerId", ""),
            title=data.get("title", ""),
            description=data.get("description", ""),
            type=data.get("type", ""),
            price=data.get("price", 0.0),
            rooms=data.get("rooms", 0),
            bathrooms=data.get("bathrooms", 0),
            surface=data.get("surface", 0.0),
            region=data.get("region", ""),
            city=data.get("city", ""),
            address=data.get("address", ""),
            coordinates=data.get("coordinates", {}),
            status=data.get("status", "available"),
            images=data.get("images", []),
            features=data.get("features", []),
            is_featured=data.get("isFeatured", False),
            is_premium=data.get("isPremium", False),
            visits=data.get("visits", 0),
            contact_requests=data.get("contactRequests", 0),
            created_at=datetime.fromisoformat(data["createdAt"]) if isinstance(data.get("createdAt"), str) else data.get("createdAt"),
            updated_at=datetime.fromisoformat(data["updatedAt"]) if isinstance(data.get("updatedAt"), str) else data.get("updatedAt")
        )

