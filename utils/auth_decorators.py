from functools import wraps
from flask import request, jsonify
from services.auth_service import AuthService
from models.user import User
def token_required(f):
    """Décorateur pour protéger les routes avec authentification JWT"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({
                    'success': False,
                    'error': 'Token invalide. Format attendu: Bearer <token>'
                }), 401
        if not token:
            return jsonify({
                'success': False,
                'error': 'Token manquant. Ajoutez-le dans le header Authorization'
            }), 401
        payload = AuthService.verify_token(token)
        if not payload:
            return jsonify({
                'success': False,
                'error': 'Token invalide ou expiré'
            }), 401
        user = AuthService.get_current_user(token)
        if not user:
            return jsonify({
                'success': False,
                'error': 'Utilisateur non trouvé'
            }), 401
        return f(*args, current_user=user, **kwargs)
    return decorated
def role_required(*allowed_roles):
    """Décorateur pour vérifier le rôle de l'utilisateur"""
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated(*args, current_user: User = None, **kwargs):
            if not current_user:
                return jsonify({
                    'success': False,
                    'error': 'Authentification requise'
                }), 401
            if current_user.role not in allowed_roles:
                return jsonify({
                    'success': False,
                    'error': f'Accès refusé. Rôles autorisés: {", ".join(allowed_roles)}'
                }), 403
            return f(*args, current_user=current_user, **kwargs)
        return decorated
    return decorator
def owner_or_admin_required(f):
    """Décorateur pour vérifier que l'utilisateur est propriétaire ou admin"""
    @wraps(f)
    @token_required
    def decorated(*args, current_user: User = None, **kwargs):
        if not current_user:
            return jsonify({
                'success': False,
                'error': 'Authentification requise'
            }), 401
        if current_user.role not in ['owner', 'admin']:
            return jsonify({
                'success': False,
                'error': 'Accès refusé. Seuls les propriétaires et administrateurs peuvent accéder à cette ressource'
            }), 403
        return f(*args, current_user=current_user, **kwargs)
    return decorated
def admin_required(f):
    """Décorateur pour vérifier que l'utilisateur est admin"""
    @wraps(f)
    @token_required
    def decorated(*args, current_user: User = None, **kwargs):
        if not current_user:
            return jsonify({
                'success': False,
                'error': 'Authentification requise'
            }), 401
        if current_user.role != 'admin':
            return jsonify({
                'success': False,
                'error': 'Accès refusé. Seuls les administrateurs peuvent accéder à cette ressource'
            }), 403
        return f(*args, current_user=current_user, **kwargs)
    return decorated
