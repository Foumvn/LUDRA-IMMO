#!/bin/bash

# Script de test pour l'API Immobilier
# Usage: ./test_api.sh

BASE_URL="http://localhost:5000"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Tests de l'API Immobilier ===${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}1. Test Health Check${NC}"
curl -s -X GET $BASE_URL/api/health | jq . 2>/dev/null || curl -s -X GET $BASE_URL/api/health
echo -e "\n"

# Test 2: Inscription
echo -e "${YELLOW}2. Inscription d'un utilisateur${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "password": "test123456",
    "name": "Test User",
    "phone": "+33123456789",
    "city": "Paris",
    "role": "owner"
  }')
echo $REGISTER_RESPONSE | jq . 2>/dev/null || echo $REGISTER_RESPONSE

# Extraire le token
if command -v jq &> /dev/null; then
    TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token // empty')
    USER_ID=$(echo $REGISTER_RESPONSE | jq -r '.data.user.uid // empty')
else
    # Extraction basique sans jq
    TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"uid":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo -e "${YELLOW}Échec de l'inscription, tentative de connexion...${NC}"
    LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com",
        "password": "test123456"
      }')
    if command -v jq &> /dev/null; then
        TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token // empty')
        USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.data.user.uid // empty')
    else
        TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
        USER_ID=$(echo $LOGIN_RESPONSE | grep -o '"uid":"[^"]*' | cut -d'"' -f4)
    fi
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo -e "${YELLOW}Impossible d'obtenir un token. Créez d'abord un utilisateur via l'API.${NC}"
    exit 1
fi

echo -e "${GREEN}Token obtenu: ${TOKEN:0:50}...${NC}"
echo -e "${GREEN}User ID: $USER_ID${NC}\n"

# Test 3: Utilisateur connecté
echo -e "${YELLOW}3. Récupérer l'utilisateur connecté${NC}"
curl -s -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq . 2>/dev/null || \
curl -s -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# Test 4: Créer une propriété
echo -e "${YELLOW}4. Créer une propriété${NC}"
PROPERTY_RESPONSE=$(curl -s -X POST $BASE_URL/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Appartement Test",
    "description": "Appartement de test pour l API",
    "type": "apartment",
    "price": 200000,
    "rooms": 2,
    "bathrooms": 1,
    "surface": 60,
    "region": "Île-de-France",
    "city": "Paris",
    "address": "123 Rue Test, 75001 Paris",
    "status": "available",
    "features": ["balcon", "ascenseur"]
  }')
echo $PROPERTY_RESPONSE | jq . 2>/dev/null || echo $PROPERTY_RESPONSE

# Extraire l'ID de la propriété
if command -v jq &> /dev/null; then
    PROPERTY_ID=$(echo $PROPERTY_RESPONSE | jq -r '.data.id // empty')
else
    PROPERTY_ID=$(echo $PROPERTY_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
fi

if [ ! -z "$PROPERTY_ID" ] && [ "$PROPERTY_ID" != "null" ]; then
    echo -e "${GREEN}Property ID: $PROPERTY_ID${NC}\n"
    
    # Test 5: Récupérer la propriété
    echo -e "${YELLOW}5. Récupérer la propriété créée${NC}"
    curl -s -X GET "$BASE_URL/api/properties/$PROPERTY_ID" | jq . 2>/dev/null || \
    curl -s -X GET "$BASE_URL/api/properties/$PROPERTY_ID"
    echo -e "\n"
    
    # Test 6: Ajouter aux favoris
    echo -e "${YELLOW}6. Ajouter la propriété aux favoris${NC}"
    curl -s -X POST $BASE_URL/api/favorites \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "{\"propertyId\": \"$PROPERTY_ID\"}" | jq . 2>/dev/null || \
    curl -s -X POST $BASE_URL/api/favorites \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "{\"propertyId\": \"$PROPERTY_ID\"}"
    echo -e "\n"
    
    # Test 7: Mes favoris
    echo -e "${YELLOW}7. Récupérer mes favoris${NC}"
    curl -s -X GET "$BASE_URL/api/favorites/me" \
      -H "Authorization: Bearer $TOKEN" | jq . 2>/dev/null || \
    curl -s -X GET "$BASE_URL/api/favorites/me" \
      -H "Authorization: Bearer $TOKEN"
    echo -e "\n"
fi

# Test 8: Liste des propriétés
echo -e "${YELLOW}8. Liste des propriétés (avec filtres)${NC}"
curl -s -X GET "$BASE_URL/api/properties?limit=5" | jq . 2>/dev/null || \
curl -s -X GET "$BASE_URL/api/properties?limit=5"
echo -e "\n"

# Test 9: Dashboard
if [ ! -z "$USER_ID" ] && [ "$USER_ID" != "null" ]; then
    echo -e "${YELLOW}9. Dashboard du propriétaire${NC}"
    curl -s -X GET "$BASE_URL/api/dashboard/owner/$USER_ID" \
      -H "Authorization: Bearer $TOKEN" | jq . 2>/dev/null || \
    curl -s -X GET "$BASE_URL/api/dashboard/owner/$USER_ID" \
      -H "Authorization: Bearer $TOKEN"
    echo -e "\n"
fi

echo -e "${GREEN}=== Tests terminés ===${NC}"

