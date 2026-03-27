from flask import jsonify
from typing import Any, Dict
def success_response(data: Any, status_code: int = 200) -> tuple:
    """Crée une réponse JSON de succès"""
    response = {
        "success": True,
        "data": data
    }
    return jsonify(response), status_code
def error_response(message: str, status_code: int = 400) -> tuple:
    """Crée une réponse JSON d'erreur"""
    response = {
        "success": False,
        "error": message
    }
    return jsonify(response), status_code
