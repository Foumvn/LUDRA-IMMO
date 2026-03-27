from typing import Optional, Dict, Any
def validate_property_data(data: Dict[str, Any]) -> Optional[str]:
    """Valide les données d'une propriété"""
    required_fields = ['ownerId', 'title', 'description', 'type', 'price', 'rooms', 'bathrooms', 'surface', 'region', 'city', 'address']
    for field in required_fields:
        if field not in data or not data[field]:
            return f"Le champ '{field}' est requis"
    valid_types = ['apartment', 'studio', 'room', 'house', 'villa']
    if data.get('type') not in valid_types:
        return f"Le type doit être l'un des suivants: {', '.join(valid_types)}"
    valid_statuses = ['available', 'occupied', 'pending', 'sold', 'rented']
    if 'status' in data and data['status'] not in valid_statuses:
        return f"Le statut doit être l'un des suivants: {', '.join(valid_statuses)}"
    try:
        float(data.get('price', 0))
        int(data.get('rooms', 0))
        int(data.get('bathrooms', 0))
        float(data.get('surface', 0))
    except (ValueError, TypeError):
        return "Les champs price, rooms, bathrooms et surface doivent être numériques"
    if 'coordinates' in data:
        coords = data['coordinates']
        if not isinstance(coords, dict):
            return "Les coordonnées doivent être un objet"
        if 'latitude' in coords and not isinstance(coords['latitude'], (int, float)):
            return "La latitude doit être un nombre"
        if 'longitude' in coords and not isinstance(coords['longitude'], (int, float)):
            return "La longitude doit être un nombre"
    return None
def validate_user_data(data: Dict[str, Any]) -> Optional[str]:
    """Valide les données d'un utilisateur"""
    required_fields = ['uid', 'name', 'email', 'phone', 'city']
    for field in required_fields:
        if field not in data or not data[field]:
            return f"Le champ '{field}' est requis"
    valid_roles = ['user', 'owner', 'admin']
    if 'role' in data and data['role'] not in valid_roles:
        return f"Le rôle doit être l'un des suivants: {', '.join(valid_roles)}"
    valid_statuses = ['active', 'inactive', 'banned']
    if 'status' in data and data['status'] not in valid_statuses:
        return f"Le statut doit être l'un des suivants: {', '.join(valid_statuses)}"
    if '@' not in data.get('email', ''):
        return "L'email doit être valide"
    return None
