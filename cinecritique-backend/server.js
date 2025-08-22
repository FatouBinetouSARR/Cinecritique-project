// Importer les dépendances
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Charger les variables d'environnement
dotenv.config();

// Créer l'application Express
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

// CORS (adapter l'origine pour votre frontend)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Secrets et expirations
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev_access_secret_change_me";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_change_me";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

// "Base de données" en mémoire (à remplacer par une vraie DB)
const users = new Map(); // key: email, value: { id, email, passwordHash }
const refreshTokensStore = new Map(); // key: refreshToken, value: { userId, rotationCounter }
let userAutoIncrementId = 1;

// Helpers
function signAccessToken(payload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

function setRefreshTokenCookie(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshTokenCookie(res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: "strict",
    path: "/api/auth/refresh",
  });
}

function generateTokens(user) {
  const accessToken = signAccessToken({ userId: user.id, email: user.email });
  const refreshToken = signRefreshToken({ userId: user.id });
  return { accessToken, refreshToken };
}

// Middleware d'authentification pour routes protégées
function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "Token d'accès manquant" });
  }
  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token d'accès invalide ou expiré" });
  }
}

// Routes
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API CineCritique 🎬");
});

// Inscription
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  const normalizedEmail = String(email).toLowerCase().trim();
  if (users.has(normalizedEmail)) {
    return res.status(409).json({ message: "Utilisateur déjà existant" });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = { id: userAutoIncrementId++, email: normalizedEmail, passwordHash };
    users.set(normalizedEmail, newUser);

    const { accessToken, refreshToken } = generateTokens(newUser);
    // Stocker refresh token et rotation
    refreshTokensStore.set(refreshToken, { userId: newUser.id, rotationCounter: 1 });
    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      user: { id: newUser.id, email: newUser.email },
      accessToken,
    });
  } catch (err) {
    return res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
});

// Connexion
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  const normalizedEmail = String(email).toLowerCase().trim();
  const existingUser = users.get(normalizedEmail);
  if (!existingUser) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }
  const isValid = await bcrypt.compare(password, existingUser.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const { accessToken, refreshToken } = generateTokens(existingUser);
  refreshTokensStore.set(refreshToken, { userId: existingUser.id, rotationCounter: 1 });
  setRefreshTokenCookie(res, refreshToken);

  return res.status(200).json({
    user: { id: existingUser.id, email: existingUser.email },
    accessToken,
  });
});

// Refresh Token (rotation)
app.post("/api/auth/refresh", (req, res) => {
  const tokenFromCookie = req.cookies?.refreshToken;
  if (!tokenFromCookie) {
    return res.status(401).json({ message: "Refresh token manquant" });
  }

  try {
    const payload = jwt.verify(tokenFromCookie, JWT_REFRESH_SECRET);
    const stored = refreshTokensStore.get(tokenFromCookie);
    if (!stored || stored.userId !== payload.userId) {
      // Jeton inconnu ou volé -> invalider
      refreshTokensStore.delete(tokenFromCookie);
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: "Refresh token invalide" });
    }

    // Rotation: invalider l'ancien et en créer un nouveau
    refreshTokensStore.delete(tokenFromCookie);

    // Rechercher l'utilisateur
    const user = Array.from(users.values()).find((u) => u.id === payload.userId);
    if (!user) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    const newAccessToken = signAccessToken({ userId: user.id, email: user.email });
    const newRefreshToken = signRefreshToken({ userId: user.id });
    refreshTokensStore.set(newRefreshToken, { userId: user.id, rotationCounter: 1 });
    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({ message: "Refresh token expiré ou invalide" });
  }
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  const tokenFromCookie = req.cookies?.refreshToken;
  if (tokenFromCookie) {
    refreshTokensStore.delete(tokenFromCookie);
  }
  clearRefreshTokenCookie(res);
  return res.status(200).json({ message: "Déconnecté" });
});

// Route protégée d'exemple
app.get("/api/profile", authenticateAccessToken, (req, res) => {
  const user = Array.from(users.values()).find((u) => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }
  return res.status(200).json({ id: user.id, email: user.email });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur CineCritique démarré sur http://localhost:${PORT}`);
  console.log(`📱 Frontend attendu sur: ${FRONTEND_ORIGIN}`);
  console.log(`🔒 Mode: ${NODE_ENV}`);
  console.log(`🍪 Cookies sécurisés: ${isProduction ? 'OUI' : 'NON'}`);
});
