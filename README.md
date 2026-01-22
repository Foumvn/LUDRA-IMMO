# Plateforme de Gestion Immobilière - Backend Flask

API REST pour la gestion immobilière avec Flask et Firebase (Firestore + Storage).

## Structure du Projet

```
Immo/
├── app.py                 # Point d'entrée de l'application
├── config.py              # Configuration de l'application
├── requirements.txt       # Dépendances Python
├── models/                # Modèles de données
│   ├── user.py
│   ├── property.py
│   └── favorite.py
├── services/              # Services métier
│   ├── firebase_service.py
│   ├── storage_service.py
│   ├── property_service.py
│   ├── user_service.py
│   ├── dashboard_service.py
│   ├── favorite_service.py
│   └── auth_service.py
├── routes/                # Routes/Endpoints
│   ├── property_routes.py
│   ├── user_routes.py
│   ├── favorite_routes.py
│   ├── dashboard_routes.py
│   └── auth_routes.py
└── utils/                 # Utilitaires
    ├── validators.py
    ├── helpers.py
    └── auth_decorators.py
```

## Installation

1. Installer les dépendances:
```bash
pip install -r requirements.txt
```

2. Configurer les variables d'environnement:
Créer un fichier `.env` à la racine du projet avec:
```
FIREBASE_CREDENTIALS_PATH=path/to/firebase-credentials.json
FIREBASE_STORAGE_BUCKET=your-bucket-name.appspot.com
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DELTA=86400
PORT=5000
HOST=0.0.0.0
```

3. Lancer l'application:
```bash
python app.py
```

## Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Voir [AUTHENTICATION.md](AUTHENTICATION.md) pour la documentation complète.

**Endpoints d'authentification:**
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur connecté
- `POST /api/auth/change-password` - Changer le mot de passe
- `POST /api/auth/verify-token` - Vérifier un token

**Utilisation:**
```bash
# Inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "pass123", "name": "John", "phone": "+33123456789", "city": "Paris"}'

# Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "pass123"}'

# Utiliser le token dans les requêtes
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## Endpoints API

### Propriétés

- `POST /api/properties` - Créer une propriété (🔒 owner/admin)
- `GET /api/properties` - Liste toutes les propriétés (avec filtres) (public)
- `GET /api/properties/<property_id>` - Récupérer une propriété (public)
- `GET /api/properties/owner/<owner_id>` - Propriétés d'un propriétaire (🔒 owner/admin)
- `PUT /api/properties/<property_id>` - Mettre à jour une propriété (🔒 owner/admin)
- `DELETE /api/properties/<property_id>` - Supprimer une propriété (🔒 owner/admin)
- `POST /api/properties/<property_id>/contact` - Enregistrer une demande de contact (🔒 user)

### Utilisateurs

- `POST /api/users` - Créer un utilisateur (🔒 admin)
- `GET /api/users` - Liste tous les utilisateurs (🔒 admin)
- `GET /api/users/<uid>` - Récupérer un utilisateur (public)
- `PUT /api/users/<uid>` - Mettre à jour un utilisateur (🔒 user/admin)
- `DELETE /api/users/<uid>` - Supprimer un utilisateur (🔒 user/admin)

### Favoris

- `POST /api/favorites` - Ajouter un favori (🔒 user)
- `GET /api/favorites/me` - Mes favoris (🔒 user)
- `DELETE /api/favorites/<property_id>` - Retirer un favori (🔒 user)
- `GET /api/favorites/<property_id>/check` - Vérifier si favori (🔒 user)

### Dashboard

- `GET /api/dashboard/owner/<owner_id>` - Dashboard propriétaire (🔒 owner/admin)

### Santé

- `GET /api/health` - Vérifier l'état de l'API

## Modèles de Données

### User
```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "city": "string",
  "role": "user|owner|admin",
  "emailVerified": boolean,
  "phoneVerified": boolean,
  "createdAt": timestamp,
  "updatedAt": timestamp,
  "avatar": "url",
  "favorites": ["propId1", "propId2"],
  "status": "active|inactive|banned",
  "preferences": {
    "notifications": boolean,
    "newsletter": boolean
  }
}
```

### Property
```json
{
  "id": "string",
  "ownerId": "string",
  "title": "string",
  "description": "string",
  "type": "apartment|studio|room|house|villa",
  "price": number,
  "rooms": number,
  "bathrooms": number,
  "surface": number,
  "region": "string",
  "city": "string",
  "address": "string",
  "coordinates": {
    "latitude": number,
    "longitude": number
  },
  "status": "available|occupied|pending|sold|rented",
  "images": ["url1", "url2"],
  "features": ["feature1", "feature2"],
  "isFeatured": boolean,
  "isPremium": boolean,
  "createdAt": timestamp,
  "updatedAt": timestamp,
  "visits": number,
  "contactRequests": number
}
```

### Favorite
```json
{
  "id": "string",
  "userId": "string",
  "propertyId": "string",
  "createdAt": timestamp
}
```

## Exemples d'utilisation

### Créer une propriété
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "ownerId": "user123",
    "title": "Appartement moderne",
    "description": "Bel appartement...",
    "type": "apartment",
    "price": 150000,
    "rooms": 3,
    "bathrooms": 2,
    "surface": 85,
    "region": "Île-de-France",
    "city": "Paris",
    "address": "123 Rue Example"
  }'
```

### Récupérer le dashboard d'un propriétaire
```bash
curl http://localhost:5000/api/dashboard/owner/user123
```

## Notes

- Les images sont uploadées vers Firebase Storage lors de la création/mise à jour d'une propriété
- Les visites et demandes de contact sont automatiquement incrémentées
- Les favoris sont synchronisés avec la liste des favoris de l'utilisateur
- L'authentification JWT est requise pour la plupart des opérations
- Les mots de passe sont hashés avec bcrypt avant stockage
- Les tokens JWT expirent après 24 heures par défaut

## Documentation supplémentaire

- [AUTHENTICATION.md](AUTHENTICATION.md) - Documentation complète de l'authentification
- [API_EXAMPLES.md](API_EXAMPLES.md) - Exemples d'utilisation de l'API
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture du projet

# LUDRA-IMMO
