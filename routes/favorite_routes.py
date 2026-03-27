from flask import Blueprint, request, jsonify
from services.favorite_service import FavoriteService
from utils.helpers import error_response, success_response
from utils.auth_decorators import token_required
from models.user import User
favorite_bp = Blueprint('favorites', __name__)
@favorite_bp.route('', methods=['POST'])
@token_required
def add_favorite(current_user: User):
    """
    Ajouter une propriété aux favoris
    ---
    tags:
      - Favorites
    summary: Ajouter une propriété aux favoris
    description: Ajoute une propriété à la liste des favoris de l'utilisateur connecté.
    security:
      - Bearer: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - propertyId
            properties:
              propertyId:
                type: string
                description: ID de la propriété à ajouter
                example: prop123
    responses:
      201:
        description: Favori ajouté avec succès
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
      500:
        description: Erreur serveur
    """
    try:
        data = request.get_json()
        if not data or 'propertyId' not in data:
            return error_response("propertyId est requis", 400)
        favorite = FavoriteService.add_favorite(current_user.uid, data['propertyId'])
        return success_response(favorite.to_dict(), 201)
    except Exception as e:
        return error_response(f"Erreur lors de l'ajout aux favoris: {str(e)}", 500)
@favorite_bp.route('/me', methods=['GET'])
@token_required
def get_my_favorites(current_user: User):
    """
    Récupérer tous les favoris de l'utilisateur connecté
    ---
    tags:
      - Favorites
    summary: Obtenir la liste des favoris
    description: Récupère toutes les propriétés favorites de l'utilisateur connecté.
    security:
      - Bearer: []
    responses:
      200:
        description: Liste des favoris
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
        favorites = FavoriteService.get_user_favorites(current_user.uid)
        return success_response([fav.to_dict() for fav in favorites])
    except Exception as e:
        return error_response(f"Erreur lors de la récupération des favoris: {str(e)}", 500)
@favorite_bp.route('/<property_id>', methods=['DELETE'])
@token_required
def remove_favorite(current_user: User, property_id):
    """
    Retirer une propriété des favoris
    ---
    tags:
      - Favorites
    summary: Supprimer un favori
    description: Retire une propriété de la liste des favoris de l'utilisateur connecté.
    security:
      - Bearer: []
    parameters:
      - name: property_id
        in: path
        required: true
        schema:
          type: string
        description: ID de la propriété à retirer
    responses:
      200:
        description: Favori retiré avec succès
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
                      example: Favori retiré avec succès
      404:
        description: Favori non trouvé
      500:
        description: Erreur serveur
    """
    try:
        success = FavoriteService.remove_favorite(current_user.uid, property_id)
        if not success:
            return error_response("Favori non trouvé", 404)
        return success_response({"message": "Favori retiré avec succès"})
    except Exception as e:
        return error_response(f"Erreur lors de la suppression du favori: {str(e)}", 500)
@favorite_bp.route('/<property_id>/check', methods=['GET'])
@token_required
def check_favorite(current_user: User, property_id):
    """
    Vérifier si une propriété est dans les favoris
    ---
    tags:
      - Favorites
    summary: Vérifier le statut favori
    description: Vérifie si une propriété est dans les favoris de l'utilisateur connecté.
    security:
      - Bearer: []
    parameters:
      - name: property_id
        in: path
        required: true
        schema:
          type: string
        description: ID de la propriété à vérifier
    responses:
      200:
        description: Statut du favori
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
                    isFavorite:
                      type: boolean
                      example: true
      500:
        description: Erreur serveur
    """
    try:
        is_favorite = FavoriteService.is_favorite(current_user.uid, property_id)
        return success_response({"isFavorite": is_favorite})
    except Exception as e:
        return error_response(f"Erreur lors de la vérification: {str(e)}", 500)
