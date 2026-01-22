# Documentation d'Authentification

## Vue d'ensemble

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Les tokens sont générés lors de l'inscription ou de la connexion et doivent être inclus dans les requêtes pour accéder aux routes protégées.

## Endpoints d'authentification

### POST /api/auth/register

Enregistre un nouvel utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+33123456789",
  "city": "Paris",
  "role": "user"  // optionnel: "user", "owner", "admin" (défaut: "user")
}
```

**Réponse (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "uuid",
      "name": "John Doe",
      "email": "user@example.com",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /api/auth/login

Connecte un utilisateur existant.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### GET /api/auth/me

Récupère l'utilisateur actuellement connecté (nécessite authentification).

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "uid": "uuid",
    "name": "John Doe",
    ...
  }
}
```

### POST /api/auth/change-password

Change le mot de passe de l'utilisateur connecté (nécessite authentification).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### POST /api/auth/verify-token

Vérifie si un token est valide.

**Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Utilisation du token

Pour accéder aux routes protégées, incluez le token dans le header `Authorization`:

```
Authorization: Bearer <votre_token>
```

### Exemple avec curl

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Routes protégées

### Routes nécessitant une authentification (token_required)

- `POST /api/properties` - Créer une propriété (owner/admin)
- `PUT /api/properties/<id>` - Modifier une propriété (owner de la propriété ou admin)
- `DELETE /api/properties/<id>` - Supprimer une propriété (owner de la propriété ou admin)
- `GET /api/properties/owner/<owner_id>` - Propriétés d'un owner (owner lui-même ou admin)
- `POST /api/properties/<id>/contact` - Demande de contact (user authentifié)
- `POST /api/favorites` - Ajouter un favori
- `GET /api/favorites/me` - Mes favoris
- `DELETE /api/favorites/<property_id>` - Retirer un favori
- `GET /api/favorites/<property_id>/check` - Vérifier si favori
- `GET /api/dashboard/owner/<owner_id>` - Dashboard (owner lui-même ou admin)
- `PUT /api/users/<uid>` - Modifier un utilisateur (utilisateur lui-même ou admin)
- `DELETE /api/users/<uid>` - Supprimer un utilisateur (utilisateur lui-même ou admin)

### Routes nécessitant le rôle admin (admin_required)

- `POST /api/users` - Créer un utilisateur
- `GET /api/users` - Liste tous les utilisateurs

### Routes publiques (sans authentification)

- `GET /api/properties` - Liste toutes les propriétés (avec filtres)
- `GET /api/properties/<id>` - Détails d'une propriété
- `GET /api/users/<uid>` - Détails d'un utilisateur
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/verify-token` - Vérifier un token
- `GET /api/health` - Santé de l'API

## Rôles et permissions

### user
- Peut voir les propriétés
- Peut ajouter/retirer des favoris
- Peut faire des demandes de contact
- Peut modifier/supprimer son propre compte

### owner
- Toutes les permissions de `user`
- Peut créer des propriétés
- Peut modifier/supprimer ses propres propriétés
- Peut voir son dashboard

### admin
- Toutes les permissions de `owner`
- Peut modifier/supprimer toutes les propriétés
- Peut créer/modifier/supprimer tous les utilisateurs
- Peut voir tous les dashboards

## Configuration JWT

Les paramètres JWT sont configurables dans le fichier `.env`:

```env
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DELTA=86400  # 24 heures en secondes
```

## Sécurité

- Les mots de passe sont hashés avec bcrypt avant stockage
- Les tokens JWT expirent après 24 heures par défaut
- Les tokens contiennent l'ID utilisateur, l'email et le rôle
- Les routes vérifient les permissions basées sur le rôle et la propriété

## Gestion des erreurs

### Token manquant
```json
{
  "success": false,
  "error": "Token manquant. Ajoutez-le dans le header Authorization"
}
```
Status: 401

### Token invalide ou expiré
```json
{
  "success": false,
  "error": "Token invalide ou expiré"
}
```
Status: 401

### Accès refusé
```json
{
  "success": false,
  "error": "Vous n'avez pas les droits pour modifier cette propriété"
}
```
Status: 403

## Exemples complets

### Inscription puis création d'une propriété

```bash
# 1. Inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "password123",
    "name": "Property Owner",
    "phone": "+33123456789",
    "city": "Paris",
    "role": "owner"
  }'

# Réponse contient le token, sauvegardez-le
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Créer une propriété avec le token
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Mon appartement",
    "description": "...",
    "type": "apartment",
    "price": 250000,
    ...
  }'
```

### Connexion puis récupération des favoris

```bash
# 1. Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# 2. Récupérer mes favoris
curl -X GET http://localhost:5000/api/favorites/me \
  -H "Authorization: Bearer $TOKEN"
```

