const express = require("express");
const router = express.Router();
const Mail = require("../models/mail.model");
const verifyAdmin = require("../middlewares/auth.middleware");
const handleError = require("../utils/handleError");

router.use(verifyAdmin); // router l'utilise pour chaque route dans le fichier

// CREATE : Intégralité document unique = Non utilisé par React-Admin

router.post("/", async (req, res) => {
  try {
    const mail = await Mail.create(req.body);
    res.status(201).json(mail);
  } catch (err) {
    handleError(res, err);
  }
});

// REACT ADMIN

router.put("/contact/:id", async (req, res) => {
  try {
    const mail = await Mail.findByIdAndUpdate(req.params.id, req.body, { new: true }); // { new: true } Force l'affichage de la nouvelle version le temps que la BDD reponde
    if (!mail) return handleError(res);
    res.json({ id: req.params.id }); // REACT ADMIN a besoin d'un id pour remettre a jour son cache.
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/all/:id", async (req, res) => {
  res.status(405).json({ error: "Suppression interdite : document unique." });
});

module.exports = router;