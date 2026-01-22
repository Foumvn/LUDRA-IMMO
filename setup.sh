#!/bin/bash

# Script d'installation pour l'environnement virtuel
# Exécutez avec: bash setup.sh

echo "🔧 Installation de l'environnement virtuel..."

# Vérifier si python3-venv est installé
if ! dpkg -l | grep -q python3-venv; then
    echo "📦 Installation de python3-venv (nécessite sudo)..."
    sudo apt install python3.12-venv -y
fi

# Créer l'environnement virtuel
echo "📁 Création de l'environnement virtuel..."
python3 -m venv venv

# Activer l'environnement virtuel
echo "✅ Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer les dépendances
echo "📥 Installation des dépendances..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "✅ Installation terminée !"
echo ""
echo "Pour activer l'environnement virtuel plus tard, utilisez:"
echo "  source venv/bin/activate"
echo ""
echo "Pour lancer l'application:"
echo "  python3 app.py"

