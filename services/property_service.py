from services.firebase_service import get_db
from services.storage_service import upload_images, delete_images
from models.property import Property
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from flask import request
from firebase_admin import firestore

class PropertyService:
    """Service pour gérer les propriétés"""
    
    @staticmethod
    def create_property(property_data: Dict[str, Any], images: List = None) -> Property:
        """
        Crée une nouvelle propriété
        
        Args:
            property_data: Données de la propriété
            images: Liste de fichiers d'images (optionnel)
        
        Returns:
            Objet Property créé
        """
        db = get_db()
        
        # Créer l'objet Property
        property_obj = Property.from_dict(property_data)
        property_obj.created_at = datetime.now(timezone.utc)
        property_obj.updated_at = datetime.now(timezone.utc)
        
        # Convertir en dictionnaire pour Firestore
        property_dict = property_obj.to_dict()
        # Retirer l'id du dictionnaire car Firestore le génère
        property_dict.pop('id', None)
        
        # Ajouter la propriété à Firestore
        doc_ref = db.collection('properties').add(property_dict)
        property_id = doc_ref[1].id
        
        # Upload des images si fournies
        if images:
            try:
                image_urls = upload_images(images, property_id)
                property_obj.images = image_urls
                # Mettre à jour dans Firestore
                db.collection('properties').document(property_id).update({
                    'images': image_urls,
                    'updatedAt': datetime.now(timezone.utc).isoformat()
                })
            except Exception as e:
                print(f"Erreur lors de l'upload des images: {e}")
        
        property_obj.id = property_id
        return property_obj
    
    @staticmethod
    def get_property(property_id: str) -> Optional[Property]:
        """Récupère une propriété par son ID"""
        db = get_db()
        doc = db.collection('properties').document(property_id).get()
        
        if doc.exists:
            return Property.from_dict(doc.to_dict(), doc.id)
        return None
    
    @staticmethod
    def get_properties_by_owner(owner_id: str) -> List[Property]:
        """Récupère toutes les propriétés d'un propriétaire"""
        db = get_db()
        docs = db.collection('properties').where('ownerId', '==', owner_id).get()
        
        properties = []
        for doc in docs:
            properties.append(Property.from_dict(doc.to_dict(), doc.id))
        
        return properties
    
    @staticmethod
    def get_all_properties(
        limit: int = 50,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[Property]:
        """
        Récupère toutes les propriétés avec filtres optionnels
        
        Args:
            limit: Nombre maximum de résultats
            offset: Nombre de résultats à ignorer
            filters: Dictionnaire de filtres (type, city, region, status, etc.)
        """
        db = get_db()
        query = db.collection('properties')
        
        # Appliquer les filtres
        if filters:
            if 'type' in filters:
                query = query.where('type', '==', filters['type'])
            if 'city' in filters:
                query = query.where('city', '==', filters['city'])
            if 'region' in filters:
                query = query.where('region', '==', filters['region'])
            if 'status' in filters:
                query = query.where('status', '==', filters['status'])
            if 'minPrice' in filters:
                query = query.where('price', '>=', filters['minPrice'])
            if 'maxPrice' in filters:
                query = query.where('price', '<=', filters['maxPrice'])
            if 'isFeatured' in filters:
                query = query.where('isFeatured', '==', filters['isFeatured'])
        
        # Pagination
        docs = query.limit(limit).offset(offset).get()
        
        properties = []
        for doc in docs:
            properties.append(Property.from_dict(doc.to_dict(), doc.id))
        
        return properties
    
    @staticmethod
    def update_property(property_id: str, updates: Dict[str, Any], images: List = None) -> Optional[Property]:
        """
        Met à jour une propriété
        
        Args:
            property_id: ID de la propriété
            updates: Dictionnaire des champs à mettre à jour
            images: Nouvelles images (optionnel)
        """
        db = get_db()
        doc_ref = db.collection('properties').document(property_id)
        
        if not doc_ref.get().exists:
            return None
        
        # Récupérer les anciennes images si on en ajoute de nouvelles
        old_property = PropertyService.get_property(property_id)
        old_images = old_property.images if old_property else []
        
        # Upload des nouvelles images si fournies
        if images:
            try:
                new_image_urls = upload_images(images, property_id)
                updates['images'] = old_images + new_image_urls
            except Exception as e:
                print(f"Erreur lors de l'upload des images: {e}")
        
        # Ajouter la date de mise à jour
        updates['updatedAt'] = datetime.now(timezone.utc).isoformat()
        
        # Mettre à jour dans Firestore
        doc_ref.update(updates)
        
        return PropertyService.get_property(property_id)
    
    @staticmethod
    def delete_property(property_id: str) -> bool:
        """Supprime une propriété"""
        db = get_db()
        doc_ref = db.collection('properties').document(property_id)
        
        doc = doc_ref.get()
        if not doc.exists:
            return False
        
        # Récupérer les images pour les supprimer
        property_data = doc.to_dict()
        if property_data and 'images' in property_data:
            delete_images(property_data['images'])
        
        # Supprimer la propriété
        doc_ref.delete()
        
        # Supprimer aussi les favoris associés
        favorites = db.collection('favorites').where('propertyId', '==', property_id).get()
        for fav in favorites:
            fav.reference.delete()
        
        return True
    
    @staticmethod
    def increment_visits(property_id: str):
        """Incrémente le compteur de visites"""
        db = get_db()
        doc_ref = db.collection('properties').document(property_id)
        doc_ref.update({
            'visits': firestore.Increment(1),
            'updatedAt': datetime.now(timezone.utc).isoformat()
        })
    
    @staticmethod
    def increment_contact_requests(property_id: str):
        """Incrémente le compteur de demandes de contact"""
        db = get_db()
        doc_ref = db.collection('properties').document(property_id)
        doc_ref.update({
            'contactRequests': firestore.Increment(1),
            'updatedAt': datetime.now(timezone.utc).isoformat()
        })

