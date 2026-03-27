from flask import Blueprint, request, jsonify
from services.user_service import UserService
from utils.validators import validate_user_data
from utils.helpers import error_response, success_response
from utils.auth_decorators import token_required, admin_required
from models.user import User
user_bp = Blueprint('users', __name__)
@user_bp.route('', methods=['POST'])
@admin_required
def create_user(current_user: User):
    """
    Créer un nouvel utilisateur
    ---
    tags:
      - Users
    summary: Créer un utilisateur (admin uniquement)
    description: Permet à un administrateur de créer un nouvel utilisateur.
    security:
      - Bearer: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - email
              - name
              - phone
              - city
            properties:
              email:
                type: string
                format: email
              name:
                type: string
              phone:
                type: string
              city:
                type: string
              role:
                type: string
                enum: [user, owner, admin]
                default: user
    responses:
      201:
        description: Utilisateur créé avec succès
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
        description: Droits insuffisants (admin requis)
      500:
        description: Erreur serveur
    """
    try:
        data = request.get_json()
        if not data:
            return error_response("Données manquantes", 400)
        validation_error = validate_user_data(data)
        if validation_error:
            return error_response(validation_error, 400)
        user = UserService.create_user(data)
        return success_response(user.to_dict(), 201)
    except Exception as e:
        return error_response(f"Erreur lors de la création de l'utilisateur: {str(e)}", 500)
@user_bp.route('/<uid>', methods=['GET'])
def get_user(uid):
    """
    Récupérer un utilisateur par son UID
    ---
    tags:
      - Users
    summary: Obtenir les informations d'un utilisateur
    description: Récupère les informations publiques d'un utilisateur par son ID.
    parameters:
      - name: uid
        in: path
        required: true
        schema:
          type: string
        description: ID de l'utilisateur
    responses:
      200:
        description: Utilisateur trouvé
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
        description: Utilisateur non trouvé
      500:
        description: Erreur serveur
    """
    try:
        user = UserService.get_user(uid)
        if not user:
            return error_response("Utilisateur non trouvé", 404)
        return success_response(user.to_dict())
    except Exception as e:
        return error_response(f"Erreur lors de la récupération de l'utilisateur: {str(e)}", 500)
@user_bp.route('', methods=['GET'])
@admin_required
def get_users(current_user: User):
    """
    Récupérer tous les utilisateurs
    ---
    tags:
      - Users
    summary: Lister tous les utilisateurs (admin uniquement)
    description: Récupère la liste de tous les utilisateurs avec pagination.
    security:
      - Bearer: []
    responses:
      200:
        description: Liste des utilisateurs
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
        description: Droits insuffisants (admin requis)
      500:
        description: Erreur serveur
    """
    try:
        users = UserService.get_all_users()
        return success_response([user.to_dict() for user in users])
    except Exception as e:
        return error_response(f"Erreur lors de la récupération des utilisateurs: {str(e)}", 500)
@user_bp.route('/<uid>', methods=['PUT'])
@token_required
def update_user(current_user: User, uid):
    """
    Mettre à jour un utilisateur
    ---
    tags:
      - Users
    summary: Modifier les informations d'un utilisateur
    description: |
      Met à jour les informations d'un utilisateur.
      L'utilisateur peut modifier ses propres informations, ou un admin peut modifier n'importe quel utilisateur.
    security:
      - Bearer: []
    parameters:
      - name: uid
        in: path
        required: true
        schema:
          type: string
        description: ID de l'utilisateur
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              name:
                type: string
              phone:
                type: string
              city:
                type: string
              avatar:
                type: string
              preferences:
                type: object
              role:
                type: string
                enum: [user, owner, admin]
                description: Seul un admin peut modifier le rôle
    responses:
      200:
        description: Utilisateur mis à jour avec succès
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
        description: Utilisateur non trouvé
      500:
        description: Erreur serveur
    """
    try:
        if uid != current_user.uid and current_user.role != 'admin':
            return error_response("Vous n'avez pas les droits pour modifier cet utilisateur", 403)
        data = request.get_json() or {}
        data.pop('uid', None)
        data.pop('createdAt', None)
        if current_user.role != 'admin' and 'role' in data:
            data.pop('role', None)
        user = UserService.update_user(uid, data)
        if not user:
            return error_response("Utilisateur non trouvé", 404)
        return success_response(user.to_dict())
    except Exception as e:
        return error_response(f"Erreur lors de la mise à jour de l'utilisateur: {str(e)}", 500)
@user_bp.route('/<uid>', methods=['DELETE'])
@token_required
def delete_user(current_user: User, uid):
    """
    Supprimer un utilisateur
    ---
    tags:
      - Users
    summary: Supprimer un compte utilisateur
    description: |
      Supprime un utilisateur et tous ses favoris associés.
      L'utilisateur peut supprimer son propre compte, ou un admin peut supprimer n'importe quel compte.
    security:
      - Bearer: []
    parameters:
      - name: uid
        in: path
        required: true
        schema:
          type: string
        description: ID de l'utilisateur
    responses:
      200:
        description: Utilisateur supprimé avec succès
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
                      example: Utilisateur supprimé avec succès
      403:
        description: Droits insuffisants
      404:
        description: Utilisateur non trouvé
      500:
        description: Erreur serveur
    """
    try:
        if uid != current_user.uid and current_user.role != 'admin':
            return error_response("Vous n'avez pas les droits pour supprimer cet utilisateur", 403)
        success = UserService.delete_user(uid)
        if not success:
            return error_response("Utilisateur non trouvé", 404)
        return success_response({"message": "Utilisateur supprimé avec succès"})
    except Exception as e:
        return error_response(f"Erreur lors de la suppression de l'utilisateur: {str(e)}", 500)
