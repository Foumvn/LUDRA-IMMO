from services.firebase_service import get_db
from services.property_service import PropertyService
from models.property import Property
from typing import Dict, Any, List

class DashboardService:
    """Service pour gérer le dashboard propriétaire"""
    
    @staticmethod
    def get_owner_dashboard(owner_id: str) -> Dict[str, Any]:
        """
        Récupère les données du dashboard pour un propriétaire
        
        Args:
            owner_id: ID du propriétaire
        
        Returns:
            Dictionnaire contenant les propriétés et les statistiques
        """
        # Récupérer toutes les propriétés du propriétaire
        properties = PropertyService.get_properties_by_owner(owner_id)
        
        # Calculer les statistiques
        stats = DashboardService._calculate_metrics(properties)
        
        return {
            "properties": [prop.to_dict() for prop in properties],
            "statistics": stats
        }
    
    @staticmethod
    def _calculate_metrics(properties: List[Property]) -> Dict[str, Any]:
        """
        Calcule les métriques à partir d'une liste de propriétés
        
        Args:
            properties: Liste des propriétés
        
        Returns:
            Dictionnaire de statistiques
        """
        total_properties = len(properties)
        
        # Compter par statut
        status_counts = {}
        for prop in properties:
            status = prop.status
            status_counts[status] = status_counts.get(status, 0) + 1
        
        # Compter par type
        type_counts = {}
        for prop in properties:
            prop_type = prop.type
            type_counts[prop_type] = type_counts.get(prop_type, 0) + 1
        
        # Calculer les totaux
        total_value = sum(prop.price for prop in properties)
        total_visits = sum(prop.visits for prop in properties)
        total_contact_requests = sum(prop.contact_requests for prop in properties)
        average_price = total_value / total_properties if total_properties > 0 else 0
        
        # Propriétés disponibles
        available_count = status_counts.get('available', 0)
        
        # Propriétés premium/featured
        premium_count = sum(1 for prop in properties if prop.is_premium)
        featured_count = sum(1 for prop in properties if prop.is_featured)
        
        return {
            "totalProperties": total_properties,
            "availableProperties": available_count,
            "occupiedProperties": status_counts.get('occupied', 0),
            "pendingProperties": status_counts.get('pending', 0),
            "soldProperties": status_counts.get('sold', 0),
            "rentedProperties": status_counts.get('rented', 0),
            "totalValue": total_value,
            "averagePrice": average_price,
            "totalVisits": total_visits,
            "totalContactRequests": total_contact_requests,
            "premiumProperties": premium_count,
            "featuredProperties": featured_count,
            "statusBreakdown": status_counts,
            "typeBreakdown": type_counts
        }

