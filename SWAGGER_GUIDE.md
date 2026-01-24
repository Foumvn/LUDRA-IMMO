# Guide d'utilisation de Swagger

## Installation

1. Installer les dépendances :
```bash
pip install -r requirements.txt
```

## Accès à la documentation Swagger

Une fois l'application lancée, accédez à la documentation Swagger via :

**URL de la documentation interactive :**
```
http://localhost:5000/api/docs
```

**URL du fichier JSON de spécification :**
```
http://localhost:5000/api/apispec.json
```

## Utilisation de l'interface Swagger

### 1. Authentification

Pour utiliser les endpoints protégés :

1. Allez dans la section **Auth**
2. Utilisez l'endpoint `/api/auth/register` ou `/api/auth/login` pour obtenir un token
3. Cliquez sur le bouton **"Authorize"** en haut à droite de l'interface Swagger
4. Entrez votre token au format : `Bearer <votre_token>`
5. Cliquez sur **"Authorize"** puis **"Close"**

Tous les endpoints protégés utiliseront automatiquement ce token.

### 2. Tester les endpoints

1. Sélectionnez un endpoint dans la liste
2. Cliquez sur **"Try it out"**
3. Remplissez les paramètres nécessaires
4. Cliquez sur **"Execute"**
5. Consultez la réponse dans la section **"Responses"**

### 3. Exemples de requêtes

#### Inscription d'un utilisateur
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+33123456789",
  "city": "Paris",
  "role": "user"
}
```

#### Connexion
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Créer une propriété (nécessite authentification owner/admin)
```json
POST /api/properties
Authorization: Bearer <token>
{
  "title": "Belle maison avec jardin",
  "description": "Magnifique maison de 150m²",
  "type": "house",
  "price": 350000,
  "rooms": 4,
  "bathrooms": 2,
  "surface": 150.5,
  "region": "Île-de-France",
  "city": "Paris",
  "address": "123 Rue de la Paix, 75001 Paris"
}
```

## Structure de la documentation

La documentation est organisée en 5 sections principales :

- **Auth** : Authentification et gestion des utilisateurs
- **Properties** : Gestion des propriétés immobilières
- **Users** : Gestion des utilisateurs
- **Favorites** : Gestion des favoris
- **Dashboard** : Tableaux de bord

## Schémas de données

Les schémas suivants sont définis :

- **User** : Modèle utilisateur
- **Property** : Modèle propriété immobilière
- **Favorite** : Modèle favori

## Notes importantes

- La plupart des endpoints nécessitent une authentification JWT
- Les rôles disponibles sont : `user`, `owner`, `admin`
- Certains endpoints sont réservés aux administrateurs
- Les propriétaires peuvent gérer leurs propres propriétés
- Les utilisateurs peuvent gérer leurs propres favoris

## Dépannage

### Le token n'est pas accepté
- Vérifiez que vous avez bien inclus "Bearer " avant le token
- Vérifiez que le token n'a pas expiré (24h par défaut)
- Réauthentifiez-vous si nécessaire

### Erreur CORS
- Assurez-vous que CORS est bien configuré dans `app.py`
- Vérifiez que vous accédez à l'API depuis une origine autorisée

### Endpoint non trouvé
- Vérifiez que l'application Flask est bien lancée
- Vérifiez que le blueprint est bien enregistré dans `app.py`
- Consultez les logs de l'application pour plus de détails

