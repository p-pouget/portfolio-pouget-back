const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middlewares/auth.middleware");

router.use(verifyAdmin); // router l'utilise pour chaque route dans le fichier

// SYNCHRONE
router.post("/logout", (req, res) => { // POST car modifie un état (cookie) et POST jamais exécuté automatiquement par navigateur contrairement a un GET donc moins de risque (<script src="https://ton-site.com/logout">)
  res.clearCookie("token"); // Envoi dans header et suppression par le navigateur lors de la reception
  res.status(200).json({ message: "Déconnecté" });
});


// SYNCHRONE
// Ping Out pour verifier la présence du token
router.get("/me", (req, res) => { // Verify admin est executé en premier .. si pas de token = erreur 
  res.status(200).json({ message: "Token présent" });
});


module.exports = router;