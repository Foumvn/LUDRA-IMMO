# Exemples d'utilisation de l'API

## Créer un utilisateur

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "user123",
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+33123456789",
    "city": "Paris",
    "role": "owner",
    "emailVerified": true,
    "phoneVerified": false,
    "status": "active",
    "preferences": {
      "notifications": true,
      "newsletter": false
    }
  }'
```

## Créer une propriété (sans images)

```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "ownerId": "user123",
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

## Créer une propriété avec images

```bash
curl -X POST http://localhost:5000/api/properties \
  -F "ownerId=user123" \
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
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

## Récupérer toutes les propriétés avec filtres

```bash
# Filtrer par type et ville
curl "http://localhost:5000/api/properties?type=apartment&city=Paris&limit=10"

# Filtrer par prix
curl "http://localhost:5000/api/properties?minPrice=100000&maxPrice=300000"

# Filtrer par statut
curl "http://localhost:5000/api/properties?status=available"

# Propriétés featured
curl "http://localhost:5000/api/properties?isFeatured=true"
```

## Récupérer une propriété

```bash
curl http://localhost:5000/api/properties/PROPERTY_ID
```

## Mettre à jour une propriété

```bash
curl -X PUT http://localhost:5000/api/properties/PROPERTY_ID \
  -H "Content-Type: application/json" \
  -d '{
    "price": 240000,
    "status": "pending"
  }'
```

## Ajouter des images à une propriété existante

```bash
curl -X PUT http://localhost:5000/api/properties/PROPERTY_ID \
  -F "images=@/path/to/new_image.jpg"
```

## Supprimer une propriété

```bash
curl -X DELETE http://localhost:5000/api/properties/PROPERTY_ID
```

## Récupérer les propriétés d'un propriétaire

```bash
curl http://localhost:5000/api/properties/owner/user123
```

## Enregistrer une demande de contact

```bash
curl -X POST http://localhost:5000/api/properties/PROPERTY_ID/contact
```

## Ajouter un favori

```bash
curl -X POST http://localhost:5000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user456",
    "propertyId": "PROPERTY_ID"
  }'
```

## Récupérer les favoris d'un utilisateur

```bash
curl http://localhost:5000/api/favorites/user456
```

## Vérifier si une propriété est en favori

```bash
curl http://localhost:5000/api/favorites/user456/PROPERTY_ID/check
```

## Retirer un favori

```bash
curl -X DELETE http://localhost:5000/api/favorites/user456/PROPERTY_ID
```

## Récupérer le dashboard d'un propriétaire

```bash
curl http://localhost:5000/api/dashboard/owner/user123
```

Réponse exemple:
```json
{
  "success": true,
  "data": {
    "properties": [...],
    "statistics": {
      "totalProperties": 5,
      "availableProperties": 3,
      "occupiedProperties": 1,
      "pendingProperties": 1,
      "soldProperties": 0,
      "rentedProperties": 0,
      "totalValue": 1250000,
      "averagePrice": 250000,
      "totalVisits": 150,
      "totalContactRequests": 25,
      "premiumProperties": 2,
      "featuredProperties": 1,
      "statusBreakdown": {
        "available": 3,
        "occupied": 1,
        "pending": 1
      },
      "typeBreakdown": {
        "apartment": 3,
        "studio": 2
      }
    }
  }
}
```

## Mettre à jour un utilisateur

```bash
curl -X PUT http://localhost:5000/api/users/user123 \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Lyon",
    "phoneVerified": true,
    "preferences": {
      "notifications": true,
      "newsletter": true
    }
  }'
```

## Vérifier l'état de l'API

```bash
curl http://localhost:5000/api/health
```

