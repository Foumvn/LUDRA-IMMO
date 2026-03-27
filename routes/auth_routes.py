from flask import Blueprint, request
from services.auth_service import AuthService
from utils.helpers import error_response, success_response
from utils.auth_decorators import token_required
from models.user import User
auth_bp = Blueprint('auth', __name__)
@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Enregistrer un nouvel utilisateur
    ---
    tags:
      - Auth
    summary: Créer un nouveau compte utilisateur
    description: Permet de créer un nouveau compte utilisateur. Retourne un token JWT pour l'authentification.
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
            - name
            - phone
            - city
          properties:
            email:
              type: string
              format: email
              example: user@example.com
            password:
              type: string
              format: password
              minLength: 6
              example: password123
            name:
              type: string
              example: John Doe
            phone:
              type: string
              example: +33123456789
            city:
              type: string
              example: Paris
            role:
              type: string
              enum: [user, owner, admin]
              default: user
              example: user
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
                  type: object
                  properties:
                    user:
                      $ref: '
                    token:
                      type: string
                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      400:
        description: Erreur de validation
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: Le champ 'email' est requis
      500:
        description: Erreur serveur
    """
    try:
        data = request.get_json()
        if not data:
            return error_response("Données manquantes", 400)
        required_fields = ['email', 'password', 'name', 'phone', 'city']
        for field in required_fields:
            if field not in data or not data[field]:
                return error_response(f"Le champ '{field}' est requis", 400)
        if '@' not in data['email']:
            return error_response("Email invalide", 400)
        if len(data['password']) < 6:
            return error_response("Le mot de passe doit contenir au moins 6 caractères", 400)
        role = data.get('role', 'user')
        if role not in ['user', 'owner', 'admin']:
            role = 'user'
        result = AuthService.register(
            email=data['email'],
            password=data['password'],
            name=data['name'],
            phone=data['phone'],
            city=data['city'],
            role=role
        )
        return success_response(result, 201)
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response(f"Erreur lors de l'enregistrement: {str(e)}", 500)
@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Connecter un utilisateur
    ---
    tags:
      - Auth
    summary: Authentification utilisateur
    description: Permet de se connecter avec un email et un mot de passe. Retourne un token JWT.
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              format: email
              example: user@example.com
            password:
              type: string
              format: password
              example: password123
    responses:
      200:
        description: Connexion réussie
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
                    user:
                      $ref: '
                    token:
                      type: string
                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      401:
        description: Identifiants incorrects
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: Email ou mot de passe incorrect
      500:
        description: Erreur serveur
    """
    try:
        data = request.get_json()
        if not data:
            return error_response("Données manquantes", 400)
        if 'email' not in data or 'password' not in data:
            return error_response("Email et mot de passe requis", 400)
        result = AuthService.login(
            email=data['email'],
            password=data['password']
        )
        return success_response(result)
    except ValueError as e:
        return error_response(str(e), 401)
    except Exception as e:
        return error_response(f"Erreur lors de la connexion: {str(e)}", 500)
@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user: User):
    """
    Récupérer l'utilisateur actuellement connecté
    ---
    tags:
      - Auth
    summary: Obtenir les informations de l'utilisateur connecté
    description: Retourne les informations de l'utilisateur authentifié via le token JWT.
    security:
      - Bearer: []
    responses:
      200:
        description: Informations utilisateur
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
      401:
        description: Token invalide ou manquant
      500:
        description: Erreur serveur
    """
    try:
        return success_response(current_user.to_dict())
    except Exception as e:
        return error_response(f"Erreur lors de la récupération de l'utilisateur: {str(e)}", 500)
@auth_bp.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user: User):
    """
    Changer le mot de passe de l'utilisateur connecté
    ---
    tags:
      - Auth
    summary: Modifier le mot de passe
    description: Permet à l'utilisateur connecté de changer son mot de passe.
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - oldPassword
            - newPassword
          properties:
            oldPassword:
              type: string
              format: password
              example: oldpassword123
            newPassword:
              type: string
              format: password
              minLength: 6
              example: newpassword123
    responses:
      200:
        description: Mot de passe modifié avec succès
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
                      example: Mot de passe modifié avec succès
      400:
        description: Erreur de validation
      401:
        description: Token invalide ou ancien mot de passe incorrect
      500:
        description: Erreur serveur
    """
    try:
        data = request.get_json()
        if not data:
            return error_response("Données manquantes", 400)
        if 'oldPassword' not in data or 'newPassword' not in data:
            return error_response("Ancien mot de passe et nouveau mot de passe requis", 400)
        if len(data['newPassword']) < 6:
            return error_response("Le nouveau mot de passe doit contenir au moins 6 caractères", 400)
        AuthService.change_password(
            user_id=current_user.uid,
            old_password=data['oldPassword'],
            new_password=data['newPassword']
        )
        return success_response({"message": "Mot de passe modifié avec succès"})
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response(f"Erreur lors du changement de mot de passe: {str(e)}", 500)
@auth_bp.route('/verify-token', methods=['POST'])
def verify_token():
    """
    Vérifier si un token est valide
    ---
    tags:
      - Auth
    summary: Valider un token JWT
    description: Vérifie si un token JWT est valide et retourne son payload.
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - token
          properties:
            token:
              type: string
              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    responses:
      200:
        description: Résultat de la vérification
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
                    valid:
                      type: boolean
                      example: true
                    payload:
                      type: object
                      description: Payload du token si valide
      400:
        description: Token manquant
      500:
        description: Erreur serveur
    """
    try:
        data = request.get_json()
        if not data or 'token' not in data:
            return error_response("Token requis", 400)
        payload = AuthService.verify_token(data['token'])
        if payload:
            return success_response({
                "valid": True,
                "payload": payload
            })
        else:
            return success_response({
                "valid": False
            })
    except Exception as e:
        return error_response(f"Erreur lors de la vérification: {str(e)}", 500)
