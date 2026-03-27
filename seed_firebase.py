from datetime import datetime, timezone
from services.firebase_service import initialize_firebase, get_db
def seed_database():
    db, _ = initialize_firebase()
    print("🌱 Début du seeding des données...")
    users_data = [
        {
            "uid": "user_001",
            "name": "Jean Dupont",
            "email": "jean.dupont@email.com",
            "phone": "+33612345678",
            "city": "Paris",
            "role": "user",
            "emailVerified": True,
            "phoneVerified": True,
            "avatar": None,
            "favorites": [],
            "status": "active",
            "preferences": {"notifications": True, "newsletter": True},
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "uid": "user_002",
            "name": "Marie Martin",
            "email": "marie.martin@email.com",
            "phone": "+33623456789",
            "city": "Lyon",
            "role": "user",
            "emailVerified": True,
            "phoneVerified": False,
            "avatar": None,
            "favorites": [],
            "status": "active",
            "preferences": {"notifications": True, "newsletter": False},
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "uid": "owner_001",
            "name": "Pierre Lemaire",
            "email": "pierre.lemaire@email.com",
            "phone": "+33634567890",
            "city": "Marseille",
            "role": "owner",
            "emailVerified": True,
            "phoneVerified": True,
            "avatar": None,
            "favorites": [],
            "status": "active",
            "preferences": {"notifications": True, "newsletter": True},
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "uid": "owner_002",
            "name": "Sophie Bernard",
            "email": "sophie.bernard@email.com",
            "phone": "+33645678901",
            "city": "Nice",
            "role": "owner",
            "emailVerified": True,
            "phoneVerified": True,
            "avatar": None,
            "favorites": [],
            "status": "active",
            "preferences": {"notifications": True, "newsletter": False},
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "uid": "admin_001",
            "name": "Admin Système",
            "email": "admin@immobilier.com",
            "phone": "+33656789012",
            "city": "Paris",
            "role": "admin",
            "emailVerified": True,
            "phoneVerified": True,
            "avatar": None,
            "favorites": [],
            "status": "active",
            "preferences": {"notifications": True, "newsletter": True},
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        }
    ]
    print("📁 Ajout des utilisateurs...")
    for user in users_data:
        doc_ref = db.collection('users').document(user['uid'])
        doc_ref.set(user)
        print(f"  ✓ Utilisateur: {user['name']} ({user['role']})")
    properties_data = [
        {
            "id": "prop_001",
            "ownerId": "owner_001",
            "title": "Magnifique appartement vue Seine",
            "description": "Superbe appartement de 85m² avec vue imprenable sur la Seine. Entièrement rénové avec goût, cuisine équipée, double exposition.",
            "type": "apartment",
            "price": 450000.0,
            "rooms": 4,
            "bathrooms": 2,
            "surface": 85.0,
            "region": "Île-de-France",
            "city": "Paris",
            "address": "15 Quai de la Loire, 75019 Paris",
            "coordinates": {"lat": 48.8866, "lng": 2.3694},
            "status": "available",
            "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
            "features": ["Vue Seine", "Balcon", "Cuisine équipée", "Parking", "Gardien"],
            "isFeatured": True,
            "isPremium": True,
            "visits": 156,
            "contactRequests": 23,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "prop_002",
            "ownerId": "owner_001",
            "title": "Maison familiale avec jardin",
            "description": "Grande maison de 150m² avec jardin de 300m². Idéale pour famille avec enfants. Quartier calme et résidentiel.",
            "type": "house",
            "price": 680000.0,
            "rooms": 6,
            "bathrooms": 3,
            "surface": 150.0,
            "region": "Île-de-France",
            "city": "Versailles",
            "address": "25 Rue de la Reine, 78000 Versailles",
            "coordinates": {"lat": 48.8014, "lng": 2.1301},
            "status": "available",
            "images": ["https://example.com/img3.jpg"],
            "features": ["Jardin", "Garage", "Cave", "Cheminée", "Double salon"],
            "isFeatured": True,
            "isPremium": False,
            "visits": 89,
            "contactRequests": 12,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "prop_003",
            "ownerId": "owner_002",
            "title": "Studio moderne centre-ville",
            "description": "Studio de 25m² parfaitement équipé et meublé. Idéal investissement locatif ou premier achat.",
            "type": "studio",
            "price": 125000.0,
            "rooms": 1,
            "bathrooms": 1,
            "surface": 25.0,
            "region": "Provence-Alpes-Côte d'Azur",
            "city": "Nice",
            "address": "8 Avenue Jean-Médecin, 06000 Nice",
            "coordinates": {"lat": 43.7009, "lng": 7.2684},
            "status": "available",
            "images": [],
            "features": ["Meublé", "Centre-ville", "Transport à proximité"],
            "isFeatured": False,
            "isPremium": False,
            "visits": 234,
            "contactRequests": 8,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "prop_004",
            "ownerId": "owner_002",
            "title": "Villa luxe piscine privée",
            "description": "Splendide villa de 280m² avec piscine chauffée et vue mer. Prestations haut de gamme, domotique complète.",
            "type": "villa",
            "price": 1850000.0,
            "rooms": 7,
            "bathrooms": 4,
            "surface": 280.0,
            "region": "Provence-Alpes-Côte d'Azur",
            "city": "Cannes",
            "address": "42 Boulevard de la Croisette, 06400 Cannes",
            "coordinates": {"lat": 43.5528, "lng": 7.0174},
            "status": "available",
            "images": ["https://example.com/img4.jpg", "https://example.com/img5.jpg", "https://example.com/img6.jpg"],
            "features": ["Piscine", "Vue mer", "Domotique", "Terrasse", "Parking 3 voitures", "Gardien"],
            "isFeatured": True,
            "isPremium": True,
            "visits": 312,
            "contactRequests": 45,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "prop_005",
            "ownerId": "owner_001",
            "title": "Bureau open space центр commercial",
            "description": "Locaux professionnels de 120m² en open space, idéal pour startup ou cabinet médical.",
            "type": "office",
            "price": 350000.0,
            "rooms": 5,
            "bathrooms": 2,
            "surface": 120.0,
            "region": "Auvergne-Rhône-Alpes",
            "city": "Lyon",
            "address": "156 Rue de la République, 69002 Lyon",
            "coordinates": {"lat": 45.7640, "lng": 4.8357},
            "status": "available",
            "images": ["https://example.com/img7.jpg"],
            "features": ["Open space", "Climatisation", "Fibre optique", "Parking"],
            "isFeatured": False,
            "isPremium": True,
            "visits": 67,
            "contactRequests": 5,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "prop_006",
            "ownerId": "owner_002",
            "title": "Terrain constructible vue montagne",
            "description": "Terrain de 2500m² avec vue sur les Alpes, viabilisé, permis de construire obtenu.",
            "type": "land",
            "price": 290000.0,
            "rooms": 0,
            "bathrooms": 0,
            "surface": 2500.0,
            "region": "Auvergne-Rhône-Alpes",
            "city": "Chambéry",
            "address": "Montée des Houches, 73000 Chambéry",
            "coordinates": {"lat": 45.5647, "lng": 5.9172},
            "status": "available",
            "images": [],
            "features": ["Vue montagne", "Viabilisé", "Permis de construire", "Calme"],
            "isFeatured": False,
            "isPremium": False,
            "visits": 45,
            "contactRequests": 3,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "prop_007",
            "ownerId": "owner_001",
            "title": "Appartement vendido -示例",
            "description": "Cet appartement a été vendu.",
            "type": "apartment",
            "price": 320000.0,
            "rooms": 3,
            "bathrooms": 1,
            "surface": 65.0,
            "region": "Île-de-France",
            "city": "Paris",
            "address": "78 Rue Oberkampf, 75011 Paris",
            "coordinates": {"lat": 48.8672, "lng": 2.3776},
            "status": "sold",
            "images": [],
            "features": ["Parquet", "Cuisine américaine"],
            "isFeatured": False,
            "isPremium": False,
            "visits": 198,
            "contactRequests": 15,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "prop_008",
            "ownerId": "owner_002",
            "title": "Location saisonnière avec vue",
            "description": "Joli appartement de 45m² disponible à la location saisonnière, vue panoramique.",
            "type": "apartment",
            "price": 950.0,
            "rooms": 2,
            "bathrooms": 1,
            "surface": 45.0,
            "region": "Bretagne",
            "city": "Saint-Malo",
            "address": "3 Rue Jacques Cartier, 35400 Saint-Malo",
            "coordinates": {"lat": 48.6493, "lng": -2.0254},
            "status": "rented",
            "images": ["https://example.com/img8.jpg"],
            "features": ["Vue mer", "Terrasse", "WiFi", "Draps fournis"],
            "isFeatured": True,
            "isPremium": False,
            "visits": 421,
            "contactRequests": 67,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        }
    ]
    print("🏠 Ajout des propriétés...")
    for prop in properties_data:
        doc_ref = db.collection('properties').document(prop['id'])
        doc_ref.set(prop)
        print(f"  ✓ Propriété: {prop['title']} ({prop['type']}) - {prop['status']}")
    favorites_data = [
        {
            "userId": "user_001",
            "propertyId": "prop_001",
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "userId": "user_001",
            "propertyId": "prop_004",
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "userId": "user_002",
            "propertyId": "prop_002",
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "userId": "user_002",
            "propertyId": "prop_003",
            "createdAt": datetime.now(timezone.utc).isoformat()
        }
    ]
    print("❤️ Ajout des favoris...")
    for i, fav in enumerate(favorites_data):
        doc_ref = db.collection('favorites').document(f"fav_{i+1:03d}")
        doc_ref.set(fav)
        print(f"  ✓ Favori: user {fav['userId']} → prop {fav['propertyId']}")
    print("\n✅ Seeding terminé avec succès !")
    print(f"   - 5 utilisateurs")
    print(f"   - 8 propriétés")
    print(f"   - 4 favoris")
if __name__ == "__main__":
    seed_database()
