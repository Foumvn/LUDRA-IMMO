from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from config import Config
from services.firebase_service import initialize_firebase
from routes.property_routes import property_bp
from routes.user_routes import user_bp
from routes.favorite_routes import favorite_bp
from routes.dashboard_routes import dashboard_bp
from routes.auth_routes import auth_bp

def create_app():
    """Factory function pour créer l'application Flask"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialiser CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialiser Firebase
    initialize_firebase()
    
    # Configuration Swagger
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": "apispec",
                "route": "/api/apispec.json",
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/api/docs"
    }
    
    swagger_template = {
        "swagger": "2.0",
        "info": {
            "title": "API Immobilier",
            "description": "API REST pour la gestion d'une plateforme immobilière",
            "version": "1.0.0",
            "contact": {
                "name": "Support API",
                "email": "support@immo.com"
            }
        },
        "host": "localhost:5000",
        "basePath": "/api",
        "schemes": ["http", "https"],
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "JWT token obtenu via /api/auth/login ou /api/auth/register. Format: Bearer <token>"
            }
        },
        "security": [
            {
                "Bearer": []
            }
        ],
        "tags": [
            {
                "name": "Auth",
                "description": "Authentification et gestion des utilisateurs"
            },
            {
                "name": "Properties",
                "description": "Gestion des propriétés immobilières"
            },
            {
                "name": "Users",
                "description": "Gestion des utilisateurs"
            },
            {
                "name": "Favorites",
                "description": "Gestion des favoris"
            },
            {
                "name": "Dashboard",
                "description": "Tableaux de bord"
            }
        ],
        "definitions": {
            "User": {
                "type": "object",
                "properties": {
                    "uid": {"type": "string", "description": "Identifiant unique de l'utilisateur"},
                    "name": {"type": "string", "description": "Nom de l'utilisateur"},
                    "email": {"type": "string", "format": "email", "description": "Email de l'utilisateur"},
                    "phone": {"type": "string", "description": "Numéro de téléphone"},
                    "city": {"type": "string", "description": "Ville de l'utilisateur"},
                    "role": {"type": "string", "enum": ["user", "owner", "admin"], "description": "Rôle de l'utilisateur"},
                    "emailVerified": {"type": "boolean", "description": "Email vérifié"},
                    "phoneVerified": {"type": "boolean", "description": "Téléphone vérifié"},
                    "avatar": {"type": "string", "description": "URL de l'avatar"},
                    "favorites": {"type": "array", "items": {"type": "string"}, "description": "Liste des IDs de propriétés favorites"},
                    "status": {"type": "string", "enum": ["active", "inactive", "banned"], "description": "Statut du compte"},
                    "preferences": {
                        "type": "object",
                        "properties": {
                            "notifications": {"type": "boolean"},
                            "newsletter": {"type": "boolean"}
                        }
                    },
                    "createdAt": {"type": "string", "format": "date-time"},
                    "updatedAt": {"type": "string", "format": "date-time"}
                }
            },
            "Property": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "description": "Identifiant unique de la propriété"},
                    "ownerId": {"type": "string", "description": "ID du propriétaire"},
                    "title": {"type": "string", "description": "Titre de la propriété"},
                    "description": {"type": "string", "description": "Description détaillée"},
                    "type": {"type": "string", "enum": ["house", "apartment", "villa", "studio", "office", "land"], "description": "Type de propriété"},
                    "price": {"type": "number", "format": "float", "description": "Prix en euros"},
                    "rooms": {"type": "integer", "description": "Nombre de pièces"},
                    "bathrooms": {"type": "integer", "description": "Nombre de salles de bain"},
                    "surface": {"type": "number", "format": "float", "description": "Surface en m²"},
                    "region": {"type": "string", "description": "Région"},
                    "city": {"type": "string", "description": "Ville"},
                    "address": {"type": "string", "description": "Adresse complète"},
                    "coordinates": {
                        "type": "object",
                        "properties": {
                            "lat": {"type": "number"},
                            "lng": {"type": "number"}
                        }
                    },
                    "status": {"type": "string", "enum": ["available", "sold", "rented", "unavailable"], "description": "Statut de la propriété"},
                    "images": {"type": "array", "items": {"type": "string", "format": "uri"}, "description": "URLs des images"},
                    "features": {"type": "array", "items": {"type": "string"}, "description": "Caractéristiques"},
                    "isFeatured": {"type": "boolean", "description": "Propriété mise en avant"},
                    "isPremium": {"type": "boolean", "description": "Propriété premium"},
                    "visits": {"type": "integer", "description": "Nombre de visites"},
                    "contactRequests": {"type": "integer", "description": "Nombre de demandes de contact"},
                    "createdAt": {"type": "string", "format": "date-time"},
                    "updatedAt": {"type": "string", "format": "date-time"}
                }
            },
            "Favorite": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "userId": {"type": "string"},
                    "propertyId": {"type": "string"},
                    "createdAt": {"type": "string", "format": "date-time"}
                }
            }
        }
    }
    
    # Initialiser Swagger
    Swagger(app, config=swagger_config, template=swagger_template)
    
    # Enregistrer les blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(property_bp, url_prefix='/api/properties')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(favorite_bp, url_prefix='/api/favorites')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    
    # Route de santé
    @app.route('/api/health')
    def health():
        """
        Vérifier l'état de l'API
        ---
        tags:
          - Health
        responses:
          200:
            description: API fonctionnelle
            schema:
              type: object
              properties:
                status:
                  type: string
                  example: ok
                message:
                  type: string
                  example: API is running
        """
        return {'status': 'ok', 'message': 'API is running'}, 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host=app.config['HOST'],
        port=app.config['PORT'],
        debug=app.config['DEBUG']
    )

