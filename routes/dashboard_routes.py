from flask import Blueprint, request, jsonify
from services.dashboard_service import DashboardService
from utils.helpers import error_response, success_response
from utils.auth_decorators import token_required
from models.user import User

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/owner/<owner_id>', methods=['GET'])
@token_required
def get_owner_dashboard(current_user: User, owner_id):
    """
    Récupérer le dashboard d'un propriétaire
    ---
    tags:
      - Dashboard
    summary: Obtenir les statistiques du dashboard propriétaire
    description: |
      Récupère les statistiques et données du dashboard pour un propriétaire.
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
    responses:
      200:
        description: Données du dashboard
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
                    totalProperties:
                      type: integer
                    availableProperties:
                      type: integer
                    soldProperties:
                      type: integer
                    totalVisits:
                      type: integer
                    totalContactRequests:
                      type: integer
                    recentProperties:
                      type: array
                      items:
                        $ref: '#/definitions/Property'
      403:
        description: Droits insuffisants
      500:
        description: Erreur serveur
    """
    try:
        # Vérifier les droits (propriétaire lui-même ou admin)
        if owner_id != current_user.uid and current_user.role != 'admin':
            return error_response("Vous n'avez pas les droits pour voir ce dashboard", 403)
        
        dashboard_data = DashboardService.get_owner_dashboard(owner_id)
        return success_response(dashboard_data)
    
    except Exception as e:
        return error_response(f"Erreur lors de la récupération du dashboard: {str(e)}", 500)

