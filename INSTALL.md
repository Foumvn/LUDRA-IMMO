# Instructions d'Installation

## Problème : Environnement virtuel non disponible

Votre système nécessite l'installation du package `python3-venv` pour créer des environnements virtuels.

## Solution rapide

Exécutez cette commande (vous devrez entrer votre mot de passe) :

```bash
sudo apt install python3.12-venv -y
```

Ensuite, créez et activez l'environnement virtuel :

```bash
# Créer l'environnement virtuel
python3 -m venv venv

# Activer l'environnement virtuel
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer l'application
python3 app.py
```

## Alternative : Utiliser le script d'installation

J'ai créé un script `setup.sh` qui automatise tout. Exécutez-le :

```bash
bash setup.sh
```

Le script vous demandera votre mot de passe pour installer `python3-venv` si nécessaire.

## Après l'installation

À chaque nouvelle session de terminal, activez l'environnement virtuel :

```bash
source venv/bin/activate
```

Vous verrez `(venv)` au début de votre ligne de commande quand l'environnement est activé.

