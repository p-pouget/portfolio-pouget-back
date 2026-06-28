require("dotenv").config();


// npm install express mongoose dotenv cors helmet 
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
 
const server = express();
 
// ── Sécurité & Middleware ─────────────────────────────────
server.use(helmet()); // Headers HTTP sécurisés                                
server.use(cors({ origin: [process.env.CLIENT_URL, process.env.ADMIN_URL], credentials: true })) // CORS restreint au front + redential true pour le cookie sinon le navigateur refuse d'envoyer/recevoir les cookies cross-origin(port ou domaine different).
server.use(cookieParser());
server.use(express.json());
 
const PORT = process.env.PORT || 3050;

// ── Routes ────────────────────────────────────────────────
const authRoute = require ("./routes/auth.route")
server.use("/api/login", authRoute);
const utilsRoute = require ("./routes/admin.utils.route")
server.use("/api/admin/utils", utilsRoute)
const contactRoute = require("./routes/contact.route");
server.use("/api/contact", contactRoute);

const heroRoute = require("./routes/hero.route");
server.use("/api/hero", heroRoute);
const adminHeroRoute = require("./routes/admin.hero.route");
server.use("/api/admin/hero", adminHeroRoute);

const curriculumRoute = require("./routes/curriculum.route");
server.use("/api/curriculum", curriculumRoute);
const adminCurriculumRoute = require("./routes/admin.curriculum.route");
server.use("/api/admin/curriculum", adminCurriculumRoute);

const mailRoute = require("./routes/mail.route");
server.use("/api/mail", mailRoute);
const adminMailRoute = require("./routes/admin.mail.route");
server.use("/api/admin/mail", adminMailRoute);

const projetsRoute = require("./routes/projets.route");
server.use("/api/projets", projetsRoute);
const adminProjetsRoute = require("./routes/admin.projets.route");
server.use("/api/admin/projets", adminProjetsRoute);



// ── 404 catch-all (toujours en dernier) ──────────────────
server.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

// ── Connexion MongoDB + démarrage serveur ─────────────────
async function demarrerServeur() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connexion MongoDB ok");
    server.listen(PORT, () =>
      console.log(`Serveur démarré sur le port ${PORT}`)
    );
  } catch (err) {
    console.error("Erreur connexion MongoDB :", err.message);
    process.exit(1); // Permet de tuer le process et donc d'éviter que le serveur tourne dans le vide
  }
}

demarrerServeur();