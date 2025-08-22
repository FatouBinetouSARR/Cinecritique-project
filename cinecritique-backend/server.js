// Importer express
const express = require("express");

// Créer l'application Express
const app = express();

// Middleware pour comprendre le JSON
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API CineCritique 🎬");
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur en marche sur http://localhost:${PORT}`);
});
