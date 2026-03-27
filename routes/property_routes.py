from flask import Blueprint, request, jsonify
import json
from services.property_service import PropertyService
from utils.validators import validate_property_data
from utils.helpers import error_response, success_response
from utils.auth_decorators import token_required, owner_or_admin_required
from models.user import User
property_bp = Blueprint('properties', __name__)
@property_bp.route('', methods=['POST'])
@owner_or_admin_required
def create_property(current_user: User):
    """
    Créer une nouvelle propriété
    ---
    tags:
      - Properties
    summary: Créer une nouvelle propriété immobilière
    description: |
      Crée une nouvelle propriété. Nécessite le rôle owner ou admin.
      Accepte les données en JSON ou en form-data (pour l'upload d'images).
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - title
            - description
            - type
            - price
            - rooms
            - bathrooms
            - surface
            - region
            - city
            - address
          properties:
            title:
              type: string
              example: Belle maison avec jardin
            description:
              type: string
              example: Magnifique maison de 150m² avec jardin
            type:
              type: string
              enum: [house, apartment, villa, studio, office, land]
              example: house
            price:
              type: number
              format: float
              example: 350000
            rooms:
              type: integer
              example: 4
            bathrooms:
              type: integer
              example: 2
            surface:
              type: number
              format: float
              example: 150.5
            region:
              type: string
              example: Île-de-France
            city:
              type: string
              example: Paris
            address:
              type: string
              example: 123 Rue de la Paix, 75001 Paris
            coordinates:
              type: object
              properties:
                lat:
                  type: number
                  example: 48.8566
                lng:
                  type: number
                  example: 2.3522
            status:
              type: string
              enum: [available, sold, rented, unavailable]
              default: available
            features:
              type: array
              items:
                type: string
              example: [piscine, parking, jardin]
            isFeatured:
              type: boolean
              default: false
            isPremium:
              type: boolean
              default: false
            ownerId:
              type: string
              description: ID du propriétaire (optionnel, utilise l'utilisateur connecté par défaut)
    responses:
      201:
        description: Propriété créée avec succès
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                  example: true
                data:
                  $ref: '
      400:
        description: Erreur de validation
      403:
        description: Droits insuffisants
      500:
        description: Erreur serveur
    """
    try:
        if request.is_json:
            data = request.get_json() or {}
            images = []
        else:
            data = {}
            for key in request.form:
                value = request.form[key]
                try:
                    if value.startswith('{') or value.startswith('['):
                        data[key] = json.loads(value)
                    elif value.lower() in ['true', 'false']:
                        data[key] = value.lower() == 'true'
                    elif value.isdigit():
                        data[key] = int(value)
                    elif value.replace('.', '', 1).isdigit():
                        data[key] = float(value)
                    else:
                        data[key] = value
                except:
                    data[key] = value
            images = request.files.getlist('images')
        if 'ownerId' not in data:
            data['ownerId'] = current_user.uid
        if data.get('ownerId') != current_user.uid and current_user.role != 'admin':
            return error_response("Vous ne pouvez créer des propriétés que pour votre propre compte", 403)
        validation_error = validate_property_data(data)
        if validation_error:
            return error_response(validation_error, 400)
        property_obj = PropertyService.create_property(data, images)
        return success_response(property_obj.to_dict(), 201)
    except Exception as e:
        return error_response(f"Erreur lors de la création de la propriété: {str(e)}", 500)
@property_bp.route('/<property_id>', methods=['GET'])
def get_property(property_id):
    """
    Récupérer une propriété par son ID
    ---
    tags:
      - Properties
    summary: Obtenir les détails d'une propriété
    description: Récupère les informations détaillées d'une propriété et incrémente le compteur de visites.
    parameters:
      - name: property_id
        in: path
        required: true
        schema:
          type: string
        description: ID de la propriété
        example: abc123
    responses:
      200:
        description: Propriété trouvée
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                  example: true
                data:
                  $ref: '
      404:
        description: Propriété non trouvée
      500:
        description: Erreur serveur
    """
    try:
        property_obj = PropertyService.get_property(property_id)
        if not property_obj:
            return error_response("Propriété non trouvée", 404)
        PropertyService.increment_visits(property_id)
        return success_response(property_obj.to_dict())
    except Exception as e:
        return error_response(f"Erreur lors de la récupération de la propriété: {str(e)}", 500)
@property_bp.route('', methods=['GET'])
def get_properties():
    """
    Récupérer toutes les propriétés avec filtres optionnels
    ---
    tags:
      - Properties
    summary: Lister les propriétés avec filtres
    description: |
      Récupère une liste de propriétés avec pagination et filtres optionnels.
      Les filtres peuvent être combinés.
    parameters:
      - name: type
        in: query
        schema:
          type: string
          enum: [house, apartment, villa, studio, office, land]
        description: Filtrer par type de propriété
      - name: city
        in: query
        schema:
          type: string
        description: Filtrer par ville
        example: Paris
      - name: region
        in: query
        schema:
          type: string
        description: Filtrer par région
        example: Île-de-France
      - name: status
        in: query
        schema:
          type: string
          enum: [available, sold, rented, unavailable]
        description: Filtrer par statut
      - name: minPrice
        in: query
        schema:
          type: number
          format: float
        description: Prix minimum
        example: 100000
      - name: maxPrice
        in: query
        schema:
          type: number
          format: float
        description: Prix maximum
        example: 500000
      - name: isFeatured
        in: query
        schema:
          type: boolean
        description: Filtrer les propriétés mises en avant
    responses:
      200:
        description: Liste des propriétés
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                  example: true
                data:
                  type: array
                  items:
                    $ref: '
      500:
        description: Erreur serveur
    """
    try:
        filters = {}
        if request.args.get('type'):
            filters['type'] = request.args.get('type')
        if request.args.get('city'):
            filters['city'] = request.args.get('city')
        if request.args.get('region'):
            filters['region'] = request.args.get('region')
        if request.args.get('status'):
            filters['status'] = request.args.get('status')
        if request.args.get('minPrice'):
            filters['minPrice'] = float(request.args.get('minPrice'))
        if request.args.get('maxPrice'):
            filters['maxPrice'] = float(request.args.get('maxPrice'))
        if request.args.get('isFeatured'):
            filters['isFeatured'] = request.args.get('isFeatured').lower() == 'true'
        properties = PropertyService.get_all_properties(filters=filters)
        return success_response([prop.to_dict() for prop in properties])
    except Exception as e:
        return error_response(f"Erreur lors de la récupération des propriétés: {str(e)}", 500)
@property_bp.route('/owner/<owner_id>', methods=['GET'])
@token_required
def get_properties_by_owner(current_user: User, owner_id):
    """
    Récupérer toutes les propriétés d'un propriétaire
    ---
    tags:
      - Properties
    summary: Obtenir les propriétés d'un propriétaire
    description: |
      Récupère toutes les propriétés d'un propriétaire spécifique.
      L'utilisateur doit être le propriétaire lui-même ou un admin.
    security:
      - Bearer: []
    parameters:
      - name: owner_id
        in: path
        required: true
        schema:
          type: string
        description: ID du propriétaire
        example: user123
    responses:
      200:
        description: Liste des propriétés du propriétaire
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                  example: true
                data:
                  type: array
                  items:
                    $ref: '
      403:
        description: Droits insuffisants
      500:
        description: Erreur serveur
    """
    try:
        if owner_id != current_user.uid and current_user.role != 'admin':
            return error_response("Vous n'avez pas les droits pour voir ces propriétés", 403)
        properties = PropertyService.get_properties_by_owner(owner_id)
        return success_response([prop.to_dict() for prop in properties])
    except Exception as e:
        return error_response(f"Erreur lors de la récupération des propriétés: {str(e)}", 500)
@property_bp.route('/<property_id>', methods=['PUT'])
@token_required
def update_property(current_user: User, property_id):
    """
    Mettre à jour une propriété
    ---
    tags:
      - Properties
    summary: Modifier une propriété existante
    description: |
      Met à jour une propriété. Seul le propriétaire ou un admin peut modifier.
      Accepte les données en JSON ou en form-data (pour l'upload d'images).
    security:
      - Bearer: []
    parameters:
      - name: property_id
        in: path
        required: true
        schema:
          type: string
        description: ID de la propriété
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            description:
              type: string
            type:
              type: string
              enum: [house, apartment, villa, studio, office, land]
            price:
              type: number
              format: float
            rooms:
              type: integer
            bathrooms:
              type: integer
            surface:
              type: number
              format: float
            region:
              type: string
            city:
              type: string
            address:
              type: string
            status:
              type: string
              enum: [available, sold, rented, unavailable]
            features:
              type: array
              items:
                type: string
            isFeatured:
              type: boolean
            isPremium:
              type: boolean
    responses:
      200:
        description: Propriété mise à jour avec succès
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                  example: true
                data:
                  $ref: '
      403:
        description: Droits insuffisants
      404:
        description: Propriété non trouvée
      500:
        description: Erreur serveur
    """
    try:
        property_obj = PropertyService.get_property(property_id)
        if not property_obj:
            return error_response("Propriété non trouvée", 404)
        if property_obj.owner_id != current_user.uid and current_user.role != 'admin':
            return error_response("Vous n'avez pas les droits pour modifier cette propriété", 403)
        if request.is_json:
            data = request.get_json() or {}
            images = []
        else:
            data = {}
            for key in request.form:
                value = request.form[key]
                try:
                    if value.startswith('{') or value.startswith('['):
                        data[key] = json.loads(value)
                    elif value.lower() in ['true', 'false']:
                        data[key] = value.lower() == 'true'
                    elif value.isdigit():
                        data[key] = int(value)
                    elif value.replace('.', '', 1).isdigit():
                        data[key] = float(value)
                    else:
                        data[key] = value
                except:
                    data[key] = value
            images = request.files.getlist('images')
        data.pop('id', None)
        data.pop('ownerId', None)
        data.pop('createdAt', None)
        property_obj = PropertyService.update_property(property_id, data, images)
        return success_response(property_obj.to_dict())
    except Exception as e:
        return error_response(f"Erreur lors de la mise à jour de la propriété: {str(e)}", 500)
@property_bp.route('/<property_id>', methods=['DELETE'])
@token_required
def delete_property(current_user: User, property_id):
    """
    Supprimer une propriété
    ---
    tags:
      - Properties
    summary: Supprimer une propriété
    description: |
      Supprime une propriété et toutes ses images associées.
      Seul le propriétaire ou un admin peut supprimer.
    security:
      - Bearer: []
    parameters:
      - name: property_id
        in: path
        required: true
        schema:
          type: string
        description: ID de la propriété
    responses:
      200:
        description: Propriété supprimée avec succès
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                  example: true
                data:
                  type: object
                  properties:
                    message:
                      type: string
                      example: Propriété supprimée avec succès
      403:
        description: Droits insuffisants
      404:
        description: Propriété non trouvée
      500:
        description: Erreur serveur
    """
    try:
        property_obj = PropertyService.get_property(property_id)
        if not property_obj:
            return error_response("Propriété non trouvée", 404)
        if property_obj.owner_id != current_user.uid and current_user.role != 'admin':
            return error_response("Vous n'avez pas les droits pour supprimer cette propriété", 403)
        success = PropertyService.delete_property(property_id)
        return success_response({"message": "Propriété supprimée avec succès"})
    except Exception as e:
        return error_response(f"Erreur lors de la suppression de la propriété: {str(e)}", 500)
@property_bp.route('/<property_id>/contact', methods=['POST'])
@token_required
def request_contact(current_user: User, property_id):
    """
    Enregistrer une demande de contact
    ---
    tags:
      - Properties
    summary: Envoyer une demande de contact pour une propriété
    description: Enregistre une demande de contact et incrémente le compteur de demandes.
    security:
      - Bearer: []
    parameters:
      - name: property_id
        in: path
        required: true
        schema:
          type: string
        description: ID de la propriété
    responses:
      200:
        description: Demande de contact enregistrée
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                  example: true
                data:
                  type: object
                  properties:
                    message:
                      type: string
                      example: Demande de contact enregistrée
      500:
        description: Erreur serveur
    """
    try:
        PropertyService.increment_contact_requests(property_id)
        return success_response({"message": "Demande de contact enregistrée"})
    except Exception as e:
        return error_response(f"Erreur lors de l'enregistrement de la demande: {str(e)}", 500)
