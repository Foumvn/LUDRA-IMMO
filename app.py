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
import yaml
import os
def create_app():
    """Factory function pour créer l'application Flask"""
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    initialize_firebase()
    swagger_yaml_path = os.path.join(os.path.dirname(__file__), 'swagger.yaml')
    with open(swagger_yaml_path, 'r', encoding='utf-8') as f:
        swagger_template = yaml.safe_load(f)
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
    Swagger(app, config=swagger_config, template=swagger_template)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(property_bp, url_prefix='/api/properties')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(favorite_bp, url_prefix='/api/favorites')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
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
