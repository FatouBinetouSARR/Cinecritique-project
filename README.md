# 🎬 CineCritique - Système d'authentification JWT

Projet complet avec authentification JWT, incluant un backend Node.js/Express et un frontend React/Vite.

## 🚀 Fonctionnalités

- **Inscription** : Formulaire complet avec validation
- **Connexion** : Authentification sécurisée
- **Profil utilisateur** : Page protégée affichant les informations
- **Gestion des tokens** : Access token + Refresh token avec rotation
- **Sécurité** : Cookies httpOnly, CORS configuré, validation côté client et serveur

## 📁 Structure du projet

```
Cinecritique-project/
├── cinecritique-backend/          # API Node.js + Express
│   ├── server.js                  # Serveur principal avec routes JWT
│   ├── package.json               # Dépendances backend
│   └── .env                      # Variables d'environnement
└── cinecritique-frontend-vite/    # Frontend React + Vite
    ├── src/
    │   ├── pages/
    │   │   ├── Register.tsx      # Page d'inscription
    │   │   ├── Login.tsx         # Page de connexion
    │   │   └── Profile.tsx       # Page de profil (protégée)
    │   ├── components/
    │   │   ├── Navigation.tsx    # Barre de navigation
    │   │   └── PrivateRoute.tsx  # Route protégée
    │   ├── App.tsx               # Configuration des routes
    │   └── main.tsx              # Point d'entrée
    ├── package.json               # Dépendances frontend
    └── vite.config.ts            # Configuration Vite avec proxy
```

## 🛠️ Installation et configuration

### 1. Backend (Port 3000)

```bash
cd cinecritique-backend

# Installer les dépendances
npm install

# Créer le fichier .env
```

**Contenu du fichier `.env` :**
```env
NODE_ENV=development
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
JWT_ACCESS_SECRET=dev_access_secret_change_me
JWT_REFRESH_SECRET=dev_refresh_secret_change_me
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

**Lancer le serveur :**
```bash
npm run dev
```

### 2. Frontend (Port 5173)

```bash
cd cinecritique-frontend-vite

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## 🔐 API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Renouvellement du token
- `POST /api/auth/logout` - Déconnexion

### Profil

- `GET /api/profile` - Récupérer le profil (protégé)

## 📝 Utilisation

### 1. Inscription
- Aller sur `/register`
- Remplir tous les champs obligatoires
- Validation côté client et serveur
- Redirection automatique vers `/login` après succès

### 2. Connexion
- Aller sur `/login`
- Saisir email et mot de passe
- L'accessToken est sauvegardé dans localStorage
- Redirection automatique vers `/profile`

### 3. Profil
- Page protégée accessible uniquement après connexion
- Affichage des informations utilisateur
- Bouton de déconnexion

## 🔒 Sécurité

- **Access Token** : Stocké en localStorage (expire en 15 minutes)
- **Refresh Token** : Cookie httpOnly sécurisé (expire en 7 jours)
- **Rotation des tokens** : Nouveau refresh token à chaque utilisation
- **Validation** : Côté client et serveur
- **CORS** : Configuré pour le frontend uniquement

## 🎨 Interface

- Design moderne avec TailwindCSS
- Formulaires responsifs
- Messages d'erreur clairs
- États de chargement avec spinners
- Navigation intuitive

## 🚨 Dépannage

### Erreur "ECONNREFUSED"
- Vérifier que le backend est lancé sur le port 3000
- Vérifier le fichier `.env` du backend
- Redémarrer les deux serveurs

### Problèmes de cookies
- Vérifier que `credentials: 'include'` est utilisé
- Vérifier la configuration CORS du backend

### Erreurs de validation
- Tous les champs sont obligatoires
- L'âge doit être > 0
- Les mots de passe doivent correspondre
- Format d'email valide

## 🔮 Améliorations futures

- Base de données persistante (PostgreSQL/MongoDB)
- Gestion des rôles utilisateur
- Récupération de mot de passe
- Validation d'email
- Tests automatisés
- Dockerisation

## 📞 Support

Pour toute question ou problème, vérifiez :
1. Les logs du backend dans la console
2. Les erreurs dans la console du navigateur
3. La configuration des ports et du proxy Vite
4. Les variables d'environnement

---

**Note** : Ce projet utilise des secrets JWT par défaut pour le développement. En production, utilisez des secrets forts et uniques !
