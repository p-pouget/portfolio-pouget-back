const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user.model");

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

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.json({ token, email: user.email, message: "Vous êtes connecté" });
  } catch (err) {
    res.status(500).json({ error: err.message }); // 500 = erreur serveur inattendue
  }
});

module.exports = router;
