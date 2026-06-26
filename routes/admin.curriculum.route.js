const express = require("express");
const router = express.Router();
const Curriculum = require("../models/curriculum.model");
const verifyAdmin = require("../middlewares/auth.middleware");

router.use(verifyAdmin); // router l'utilise pour chaque route dans le fichier

// CREATE : Intégralité document unique = Non utilisé par React-Admin

router.post("/", async (req, res) => {
  try {
    const curriculum = await Curriculum.create(req.body);
    res.status(201).json(curriculum);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// REACT ADMIN
// ALL = findOneAndUpdate (plutot que findByIdAndUpdate) car il s'agit a chaque fois de trouver le champs dans le document unique (CURRICULUM) et faire matcher au besoin le deuxieme parametre.

// COMPETENCES

router.put("/competences/:id", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOneAndUpdate( // Curriculum.competences.findOneAndUpdate = Undefined car competence est un champ, pas une propriété du modele.
      {}, // prends le premier document curriculum 
      { competences: req.body }, // Cible competences pour remplacement ici
      { new: true },
    );

    if (!curriculum)
      return res.status(404).json({ error: "Curriculum introuvable" });
    res.status(200).json({ id: req.params.id }); // PUT and DELETE > REACT ADMIN a besoin d'un id pour remettre a jour son cache et dans ce cas la ... virtual id = id curriculum (hack)
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/competences/:id", (req, res) => {
  res.status(405).json({ error: "Suppression interdite : document unique." });
});

// EXPERIENCES avec $push, $pull, $set = operateurs MongoDB

router.post("/experiences", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOneAndUpdate(
      {},  // prends le premier document curriculum
      { $push: { experiences: req.body } }, // = curriculum.experiences.push(req.body) . Ajoute un élement
      { new: true }
    );
    const newExp = curriculum.experiences[curriculum.experiences.length - 1]; // POST > REACT ADMIN demande en res l'élément créé.
    res.status(201).json(newExp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/experiences/:id", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOneAndUpdate(
      { "experiences._id": req.params.id }, // Fait matcher id REACT ADMIN avec _id BDD pour le recuperer
      { $set: { "experiences.$": req.body } }, // $set modifie un champ précis et le $ seul (experiences.$) = élément trouvé par le filtre au dessus
      { new: true }
    );
    if (!curriculum) return res.status(404).json({ error: "Expérience introuvable" });
    res.status(200).json({ id: req.params.id }); // PUT and DELETE > REACT ADMIN a besoin d'un id pour remettre a jour son cache
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/experiences/:id", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOneAndUpdate(
      {}, // prends le premier document curriculum
      { $pull: { experiences: { _id: req.params.id } } }, // = curriculum.experiences.pull(id) . Retire un élément du tableau
      { new: true }
    );
    if (!curriculum) return res.status(404).json({ error: "Curriculum introuvable" });
    res.json({ id: req.params.id }); // PUT and DELETE > REACT ADMIN a besoin d'un id pour remettre a jour son cache
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// FORMATIONS avec $push, $pull, $set = operateurs MongoDB

router.post("/formations", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOneAndUpdate(
      {},  // prends le premier document curriculum
      { $push: { formations: req.body } }, // = curriculum.experiences.push(req.body) . Ajoute un élement
      { new: true }
    );
    const newForm = curriculum.formations[curriculum.formations.length - 1];
    res.status(201).json(newForm); // POST > REACT ADMIN demande en res l'élément créé.
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/formations/:id", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOneAndUpdate(
      { "formations._id": req.params.id }, // Fait matcher id REACT ADMIN avec _id BDD pour le recuperer
      { $set: { "formations.$": req.body } }, // $set modifie un champ précis et le $ seul (experiences.$) = élément trouvé par le filtre au dessus
      { new: true }
    );
    if (!curriculum) return res.status(404).json({ error: "Formation introuvable" });
    res.status(200).json({ id: req.params.id }); // PUT and DELETE > REACT ADMIN a besoin d'un id pour remettre a jour son cache
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/formations/:id", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOneAndUpdate(
      {}, // prends le premier document curriculum
      { $pull: { formations: { _id: req.params.id } } }, // = curriculum.experiences.pull(id) . Retire un élément du tableau
      { new: true }
    );
    if (!curriculum) return res.status(404).json({ error: "Curriculum introuvable" });
    res.json({ id: req.params.id }); // PUT and DELETE > REACT ADMIN a besoin d'un id pour remettre a jour son cache
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PHOTO URL 

router.put("/photoUrl/:id", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOneAndUpdate( // Curriculum.photo.findOneAndUpdate = Undefined car photo est un champ, pas une propriété du modele.
      {}, // prends le premier document curriculum 
      { photo: req.body.photo }, // Cible photo pour remplacement ici
      { new: true },
    );

    if (!curriculum)
      return res.status(404).json({ error: "Curriculum introuvable" });
    res.status(200).json({ id: req.params.id }); // PUT and DELETE > REACT ADMIN a besoin d'un id pour remettre a jour son cache et dans ce cas la ... virtual id = id curriculum (hack)
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/photoUrl/:id", (req, res) => {
  res.status(405).json({ error: "Suppression interdite : document unique." });
});

module.exports = router;
