const express = require("express");
const router = express.Router();
const Projets = require("../models/projets.model");

router.get("/", async (req, res) => {
  try {
    const projets = await Projets.find(); // find() car findOne() ne renvoi qu'un seul des objets du tableau
    res.json(projets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/selected", async (req, res) => {
  try {
    const projets = await Projets.find({ selected: true }).limit(3);
    res.json(projets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// les routes spécifiques/fixes toujours avant les routes dynamiques (:param) car ces dernieres attrape tout. Express ne fait aucun tri par "précision", il prend juste la première qui matche.

router.get("/:id", async (req, res) => {
  try {
    const projet = await Projets.findById(req.params.id);
    if (!projet) return res.status(404).json({ error: "Projet introuvable" });
    res.json(projet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;