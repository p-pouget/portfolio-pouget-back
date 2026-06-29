const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user.model");
const verifyAdmin = require("../middlewares/auth.middleware");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Les champs sont requis" }); // 400 = Champs manquants ou validation Mongoose échouée
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiant/mot de passe invalide" }); // 401 = échec d'authentification
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiant/mot de passe invalide" }); // 401 = échec d'authentification
    }

    const token = jwt.sign( // .sign calcul grace au donnée fourni une signature hash
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // cookie plutot qu'un bearer. Le navigateur l'envoie automatiquement vers le backend auquel il est associé meme sur différent port/domaine
    res.cookie("token", token, {
      httpOnly: true, // Inaccessible au JS = bloquer par le navigateur
      secure: process.env.SECURE_COOKIE ? true : false, // pour la production, accepte connexion hors https || .env dev : variable absente = false boléen.. non string || .env deploy : SECURE_COOKIE=true
      sameSite: "none", // Autorise le cookie a partir sur d'autre domaine
      maxAge: 3600*1000*2
    })

    res.status(200).json({ message: "Vous êtes connecté"});
  } catch (err) {
    res.status(500).json({ error: err.message }); // 500 = erreur serveur inattendue
  }
});

module.exports = router;
