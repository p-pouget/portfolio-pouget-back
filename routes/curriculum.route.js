const express = require("express");
const router = express.Router();
const Curriculum = require("../models/curriculum.model");

router.get("/", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOne(); // findOne() renvoi un objet unique et non un tableau comme find()
    res.json(curriculum);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// les routes spécifiques/fixes toujours avant les routes dynamiques (:param) car ces dernieres attrape tout. Express ne fait aucun tri par "précision", il prend juste la première qui matche.

router.get("/experience/:id", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOne();
    if (!curriculum) return res.status(404).json({ error: "Curriculum introuvable" });

    const experience = curriculum.experiences.id(req.params.id); // .id = methode Mongoose pour les subdocoments c'est à dire deja en mémoire
    if (!experience) return res.status(404).json({ error: "Expérience introuvable" });
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});