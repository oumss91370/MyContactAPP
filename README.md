# MyContactAPP

Application de gestion de contacts full-stack avec authentification sécurisée, développée avec la stack MERN (MongoDB, Express.js, React, Node.js).

##  Fonctionnalités

- **Authentification sécurisée** avec JWT
- **Gestion complète des contacts** (CRUD)
- **Interface utilisateur moderne et réactive**
- **API RESTful** documentée avec Swagger
- **Validation des données** avec Zod
- **Sécurité renforcée** (protection contre les attaques XSS, injection, etc.)

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** avec **Express.js**
- **MongoDB** (avec Mongoose ODM)
- **JWT** pour l'authentification
- **Zod** pour la validation des données
- **Swagger** pour la documentation d'API
- **Bcrypt** pour le hachage des mots de passe

### Frontend
- **React** avec **Vite**
- **React Router** pour la navigation
- **Axios** pour les requêtes HTTP
- **Context API** pour la gestion d'état
- **Tailwind CSS** pour le style

##  Installation

### Prérequis
- Node.js (v16 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

### Configuration

1. **Cloner le dépôt**
   ```bash
   git clone [URL_DU_REPO]
   cd MyContactAPP
   ```

2. **Installer les dépendances**
   ```bash
   # Installer les dépendances du backend
   npm install
   
   # Installer les dépendances du frontend
   cd frontend
   npm install
   cd ..
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env` à la racine du projet avec les variables suivantes :
   ```env
   PORT=3000
   MONGODB_URI=votre_uri_mongodb
   JWT_SECRET=votre_secret_jwt
   NODE_ENV=development
   ```

##  Lancement de l'application

### En mode développement

1. **Démarrer le serveur backend**
   ```bash
   npm run dev
   ```

2. **Démarrer le frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Accéder à l'application**
   - Application : http://localhost:5173
   - API : http://localhost:3000
   - Documentation API : http://localhost:3000/api-docs

### En production

```bash
# Build du frontend
cd frontend
npm run build

# Démarrer le serveur de production
cd ..
npm start
```

## 📚 Documentation de l'API

La documentation complète de l'API est disponible via Swagger UI à l'adresse :
`http://localhost:3000/api-docs`

## Sécurité

- Authentification par JWT avec expiration
- Hachage des mots de passe avec Bcrypt
- Protection contre les attaques XSS
- Validation des entrées avec Zod
- Gestion sécurisée des erreurs

## 📁 Structure du Projet

```
MyContactAPP/
├── config/           # Configuration de l'application
├── controllers/      # Contrôleurs de l'API
├── models/           # Modèles de données
├── routes/           # Définition des routes
├── src/
│   ├── auth/         # Logique d'authentification
│   └── config/       # Configuration de la base de données
├── frontend/         # Application React
│   ├── public/
│   └── src/
│       ├── assets/   # Images, polices, etc.
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── .env.example      # Exemple de fichier d'environnement
└── app.js            # Point d'entrée de l'application
```
