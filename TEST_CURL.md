# Commandes curl pour tester l'API

## Base URL
```bash
BASE_URL="http://localhost:5000"
# ou pour tester depuis le réseau local
# BASE_URL="http://192.168.100.6:5000"
```

---

## 1. Santé de l'API (Public)

```bash
curl -X GET $BASE_URL/api/health
```

---

## 2. Authentification

### 2.1 Inscription (Register)

```bash
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "+33123456789",
    "city": "Paris",
    "role": "owner"
  }'
```

**Réponse attendue :** Token JWT + données utilisateur

### 2.2 Connexion (Login)

```bash
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "password123"
  }'
```

**Réponse attendue :** Token JWT + données utilisateur

**Sauvegardez le token pour les prochaines requêtes :**
```bash
TOKEN="votre_token_ici"
```

### 2.3 Récupérer l'utilisateur connecté

```bash
curl -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 2.4 Changer le mot de passe

```bash
curl -X POST $BASE_URL/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

### 2.5 Vérifier un token

```bash
curl -X POST $BASE_URL/api/auth/verify-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "'$TOKEN'"
  }'
```

---

## 3. Propriétés

### 3.1 Créer une propriété (nécessite authentification owner/admin)

```bash
curl -X POST $BASE_URL/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Appartement moderne centre-ville",
    "description": "Magnifique appartement de 85m² avec balcon, proche des transports",
    "type": "apartment",
    "price": 250000,
    "rooms": 3,
    "bathrooms": 2,
    "surface": 85,
    "region": "Île-de-France",
    "city": "Paris",
    "address": "123 Rue de la République, 75001 Paris",
    "coordinates": {
      "latitude": 48.8566,
      "longitude": 2.3522
    },
    "status": "available",
    "features": ["balcon", "ascenseur", "parking", "proche métro"],
    "isFeatured": false,
    "isPremium": false
  }'
```

**Sauvegardez l'ID de la propriété :**
```bash
PROPERTY_ID="id_de_la_propriete"
```

### 3.2 Créer une propriété avec images (form-data)

```bash
curl -X POST $BASE_URL/api/properties \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Studio cosy" \
  -F "description=Studio de 25m² bien aménagé" \
  -F "type=studio" \
  -F "price=120000" \
  -F "rooms=1" \
  -F "bathrooms=1" \
  -F "surface=25" \
  -F "region=Île-de-France" \
  -F "city=Paris" \
  -F "address=45 Avenue des Champs, 75008 Paris" \
  -F "status=available" \
  -F "images=@/chemin/vers/image1.jpg" \
  -F "images=@/chemin/vers/image2.jpg"
```

### 3.3 Récupérer toutes les propriétés (public)

```bash
curl -X GET "$BASE_URL/api/properties"
```

### 3.4 Récupérer toutes les propriétés avec filtres

```bash
# Filtrer par type
curl -X GET "$BASE_URL/api/properties?type=apartment"

# Filtrer par ville
curl -X GET "$BASE_URL/api/properties?city=Paris"

# Filtrer par prix min et max
curl -X GET "$BASE_URL/api/properties?minPrice=100000&maxPrice=300000"

# Filtrer par statut
curl -X GET "$BASE_URL/api/properties?status=available"

# Filtrer les propriétés featured
curl -X GET "$BASE_URL/api/properties?isFeatured=true"

# Combinaison de filtres
curl -X GET "$BASE_URL/api/properties?type=apartment&city=Paris&minPrice=150000&maxPrice=300000"

# Pagination
curl -X GET "$BASE_URL/api/properties?limit=10&offset=0"
```

### 3.5 Récupérer une propriété par ID (public)

```bash
curl -X GET "$BASE_URL/api/properties/$PROPERTY_ID"
```

### 3.6 Récupérer les propriétés d'un propriétaire (nécessite authentification)

```bash
curl -X GET "$BASE_URL/api/properties/owner/OWNER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### 3.7 Mettre à jour une propriété (nécessite authentification)

```bash
curl -X PUT $BASE_URL/api/properties/$PROPERTY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "price": 240000,
    "status": "pending"
  }'
```

### 3.8 Ajouter des images à une propriété existante

```bash
curl -X PUT $BASE_URL/api/properties/$PROPERTY_ID \
  -H "Authorization: Bearer $TOKEN" \
  -F "images=@/chemin/vers/nouvelle_image.jpg"
```

### 3.9 Supprimer une propriété (nécessite authentification)

```bash
curl -X DELETE "$BASE_URL/api/properties/$PROPERTY_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### 3.10 Enregistrer une demande de contact (nécessite authentification)

```bash
curl -X POST "$BASE_URL/api/properties/$PROPERTY_ID/contact" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Utilisateurs

### 4.1 Créer un utilisateur (admin uniquement)

```bash
curl -X POST $BASE_URL/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "uid": "user123",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+33987654321",
    "city": "Lyon",
    "role": "user",
    "emailVerified": true,
    "phoneVerified": false,
    "status": "active"
  }'
```

### 4.2 Récupérer tous les utilisateurs (admin uniquement)

```bash
curl -X GET "$BASE_URL/api/users?limit=50&offset=0" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 4.3 Récupérer un utilisateur par UID (public)

```bash
curl -X GET "$BASE_URL/api/users/USER_UID"
```

### 4.4 Mettre à jour un utilisateur (utilisateur lui-même ou admin)

```bash
curl -X PUT $BASE_URL/api/users/USER_UID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "city": "Lyon",
    "phoneVerified": true,
    "preferences": {
      "notifications": true,
      "newsletter": true
    }
  }'
```

### 4.5 Supprimer un utilisateur (utilisateur lui-même ou admin)

```bash
curl -X DELETE "$BASE_URL/api/users/USER_UID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Favoris

### 5.1 Ajouter un favori (nécessite authentification)

```bash
curl -X POST $BASE_URL/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "propertyId": "'$PROPERTY_ID'"
  }'
```

### 5.2 Récupérer mes favoris (nécessite authentification)

```bash
curl -X GET "$BASE_URL/api/favorites/me" \
  -H "Authorization: Bearer $TOKEN"
```

### 5.3 Vérifier si une propriété est en favori (nécessite authentification)

```bash
curl -X GET "$BASE_URL/api/favorites/$PROPERTY_ID/check" \
  -H "Authorization: Bearer $TOKEN"
```

### 5.4 Retirer un favori (nécessite authentification)

```bash
curl -X DELETE "$BASE_URL/api/favorites/$PROPERTY_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6. Dashboard

### 6.1 Récupérer le dashboard d'un propriétaire (nécessite authentification)

```bash
curl -X GET "$BASE_URL/api/dashboard/owner/OWNER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Script de test complet

Créez un fichier `test_api.sh` avec ce contenu :

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "=== 1. Test Health ==="
curl -X GET $BASE_URL/api/health
echo -e "\n\n"

echo "=== 2. Inscription ==="
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "name": "Test User",
    "phone": "+33123456789",
    "city": "Paris",
    "role": "owner"
  }')
echo $REGISTER_RESPONSE | jq .

# Extraire le token (nécessite jq)
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"
echo -e "\n\n"

echo "=== 3. Connexion ==="
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }')
echo $LOGIN_RESPONSE | jq .
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
echo -e "\n\n"

echo "=== 4. Utilisateur connecté ==="
curl -s -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .
echo -e "\n\n"

echo "=== 5. Créer une propriété ==="
PROPERTY_RESPONSE=$(curl -s -X POST $BASE_URL/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Property",
    "description": "Description test",
    "type": "apartment",
    "price": 200000,
    "rooms": 2,
    "bathrooms": 1,
    "surface": 60,
    "region": "Île-de-France",
    "city": "Paris",
    "address": "123 Test Street",
    "status": "available"
  }')
echo $PROPERTY_RESPONSE | jq .
PROPERTY_ID=$(echo $PROPERTY_RESPONSE | jq -r '.data.id')
echo "Property ID: $PROPERTY_ID"
echo -e "\n\n"

echo "=== 6. Récupérer la propriété ==="
curl -s -X GET "$BASE_URL/api/properties/$PROPERTY_ID" | jq .
echo -e "\n\n"

echo "=== 7. Ajouter aux favoris ==="
curl -s -X POST $BASE_URL/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"propertyId\": \"$PROPERTY_ID\"}" | jq .
echo -e "\n\n"

echo "=== 8. Mes favoris ==="
curl -s -X GET "$BASE_URL/api/favorites/me" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo -e "\n\n"

echo "=== 9. Dashboard ==="
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.data.user.uid')
curl -s -X GET "$BASE_URL/api/dashboard/owner/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo -e "\n\n"
```

Rendez-le exécutable :
```bash
chmod +x test_api.sh
./test_api.sh
```

---

## Notes importantes

1. **Remplacez les variables** : `$TOKEN`, `$PROPERTY_ID`, `$USER_UID`, etc. par les vraies valeurs
2. **Pour les images** : Utilisez le chemin absolu vers vos fichiers images
3. **Format JSON** : Assurez-vous que le JSON est valide (pas de virgule finale)
4. **Token JWT** : Le token expire après 24h par défaut
5. **Permissions** : Certaines routes nécessitent des rôles spécifiques (owner, admin)

---

## Exemples de workflow complet

### Workflow 1 : Créer un propriétaire et une propriété

```bash
# 1. Inscription
REGISTER=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@test.com",
    "password": "pass123456",
    "name": "Owner Name",
    "phone": "+33123456789",
    "city": "Paris",
    "role": "owner"
  }')

TOKEN=$(echo $REGISTER | jq -r '.data.token')
USER_ID=$(echo $REGISTER | jq -r '.data.user.uid')

# 2. Créer une propriété
curl -X POST $BASE_URL/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Ma première propriété",
    "description": "Description...",
    "type": "apartment",
    "price": 250000,
    "rooms": 3,
    "bathrooms": 2,
    "surface": 85,
    "region": "Île-de-France",
    "city": "Paris",
    "address": "123 Rue Test",
    "status": "available"
  }'
```

### Workflow 2 : Utilisateur cherche et ajoute aux favoris

```bash
# 1. Connexion
LOGIN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "pass123456"
  }')

TOKEN=$(echo $LOGIN | jq -r '.data.token')

# 2. Rechercher des propriétés
curl "$BASE_URL/api/properties?type=apartment&city=Paris&maxPrice=300000"

# 3. Ajouter aux favoris
curl -X POST $BASE_URL/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"propertyId": "PROPERTY_ID_ICI"}'
```

