const express = require("express");
const router = express.Router();
const Hero = require("../models/hero.model");
const verifyAdmin = require("../middlewares/auth.middleware");
const handleError = require("../utils/handleError");

router.use(verifyAdmin); // router l'utilise pour chaque route dans le fichier

// CREATE : Intégralité document unique = Non utilisé par React-Admin

router.post("/", async (req, res) => {
  try {
    const hero = await Hero.create(req.body);
    res.status(201).json(hero);
  } catch (err) {
    handleError(res, err);
  }
});

// REACT ADMIN

router.put("/all/:id", async (req, res) => {
  try {
    const valeurs = [req.body.valeur1, req.body.valeur2, req.body.valeur3];  // IMPORTANT sinon tableau avec un seul string. !Affichage
    const hero = await Hero.findByIdAndUpdate(req.params.id, { titre: req.body.titre, valeurs, description: req.body.description }, { new: true }); // { new: true } Force l'affichage de la nouvelle version le temps que la BDD reponde
    if (!hero) return handleError(res);
    res.json({ id: req.params.id }); // REACT ADMIN a besoin d'un id pour remettre a jour son cache.
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/all/:id", async (req, res) => {
  res.status(405).json({ error: "Suppression interdite : document unique." });
});

module.exports = router;