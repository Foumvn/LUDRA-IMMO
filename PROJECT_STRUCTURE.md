# Structure du Projet - Plateforme Immobilière

## Vue d'ensemble

Cette application Flask fournit une API REST complète pour la gestion immobilière avec Firebase (Firestore + Storage).

## Architecture

### 1. Point d'entrée
- **app.py** : Application Flask principale, initialise Firebase et enregistre les blueprints

### 2. Configuration
- **config.py** : Gestion de la configuration via variables d'environnement (.env)

### 3. Modèles (models/)
- **user.py** : Modèle utilisateur avec tous les champs requis
- **property.py** : Modèle propriété avec gestion des images et coordonnées
- **favorite.py** : Modèle favori pour les relations utilisateur-propriété

### 4. Services (services/)
- **firebase_service.py** : Initialisation et accès à Firestore et Storage
- **storage_service.py** : Upload et suppression d'images vers Firebase Storage
- **property_service.py** : Logique métier pour les propriétés (CRUD, filtres, statistiques)
- **user_service.py** : Logique métier pour les utilisateurs (CRUD)
- **dashboard_service.py** : Calcul des statistiques et métriques pour le dashboard
- **favorite_service.py** : Gestion des favoris utilisateur

### 5. Routes (routes/)
- **property_routes.py** : Endpoints pour les propriétés
  - POST /api/properties - Créer
  - GET /api/properties - Lister (avec filtres)
  - GET /api/properties/<id> - Récupérer
  - GET /api/properties/owner/<owner_id> - Par propriétaire
  - PUT /api/properties/<id> - Mettre à jour
  - DELETE /api/properties/<id> - Supprimer
  - POST /api/properties/<id>/contact - Demande de contact

- **user_routes.py** : Endpoints pour les utilisateurs
  - POST /api/users - Créer
  - GET /api/users - Lister
  - GET /api/users/<uid> - Récupérer
  - PUT /api/users/<uid> - Mettre à jour
  - DELETE /api/users/<uid> - Supprimer

- **favorite_routes.py** : Endpoints pour les favoris
  - POST /api/favorites - Ajouter
  - GET /api/favorites/<user_id> - Lister
  - DELETE /api/favorites/<user_id>/<property_id> - Retirer
  - GET /api/favorites/<user_id>/<property_id>/check - Vérifier

- **dashboard_routes.py** : Endpoints pour le dashboard
  - GET /api/dashboard/owner/<owner_id> - Dashboard propriétaire

### 6. Utilitaires (utils/)
- **validators.py** : Validation des données (User, Property)
- **helpers.py** : Fonctions helper pour les réponses JSON

## Flux de données

### Création d'une propriété
1. Client envoie données + images → Route
2. Route valide les données → Validator
3. Route appelle PropertyService.create_property()
4. PropertyService upload les images → StorageService
5. StorageService retourne les URLs
6. PropertyService crée le document dans Firestore
7. Retourne la propriété créée

### Dashboard propriétaire
1. Client demande dashboard → Route
2. Route appelle DashboardService.get_owner_dashboard()
3. DashboardService récupère les propriétés → PropertyService
4. DashboardService calcule les statistiques
5. Retourne propriétés + statistiques

## Collections Firestore

- **users** : Documents utilisateurs (ID = uid)
- **properties** : Documents propriétés (ID auto-généré)
- **favorites** : Documents favoris (ID auto-généré)

## Firebase Storage

- Structure: `{property_id}/{uuid}_{filename}`
- Images rendues publiques automatiquement
- URLs retournées pour stockage dans Firestore

## Sécurité et validation

- Validation des données avant insertion
- Types de propriétés validés (apartment, studio, room, house, villa)
- Statuts validés (available, occupied, pending, sold, rented)
- Rôles utilisateurs validés (user, owner, admin)
- Extension de fichiers images validées

## Gestion des erreurs

- Toutes les routes gèrent les exceptions
- Réponses JSON standardisées (success/error)
- Codes HTTP appropriés (200, 201, 400, 404, 500)

## Points d'attention

1. **Firebase Credentials** : Le fichier de credentials doit être configuré dans .env
2. **Storage Bucket** : Le nom du bucket doit être configuré dans .env
3. **Images** : Les images sont uploadées en public, considérer l'authentification pour la production
4. **Pagination** : Les listes supportent limit/offset mais pas de pagination avancée
5. **Filtres** : Les filtres Firestore sont limités (pas de OR, pas de filtres multiples sur différents champs)

## Améliorations futures possibles

- Authentification JWT
- Rate limiting
- Cache Redis
- Recherche full-text
- Géolocalisation avancée
- Notifications push
- Logs structurés
- Tests unitaires et d'intégration

