const express = require("express");
const router = express.Router();
const Projets = require("../models/projets.model");
const verifyAdmin = require("../middlewares/auth.middleware");
const handleError = require("../utils/handleError");

router.use(verifyAdmin); // router l'utilise pour chaque route dans le fichier

// REACT ADMIN

router.post("/", async (req, res) => {
  try {
    const projet = await Projets.create(req.body);
    res.status(201).json(projet); // Renvoi la création a react admin
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const projet = await Projets.findByIdAndUpdate(req.params.id, req.body, { new: true }); // { new: true } Force l'affichage de la nouvelle version le temps que la BDD reponde
    if (!projet) return handleError(res);
    res.json({ id: req.params.id }); // REACT ADMIN a besoin d'un id pour remettre a jour son cache sur put and delete
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const projet = await Projets.findByIdAndDelete(req.params.id);
    if (!projet) return handleError(res);
    res.json({ id: req.params.id }); // REACT ADMIN a besoin d'un id pour remettre a jour son cache sur put and delete
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;