const express = require("express");
const router = express.Router();
const Projets = require("../models/projets.model");
const verifyAdmin = require("../middlewares/auth.middleware");

router.use(verifyAdmin); // router l'utilise pour chaque route dans le fichier

// CREATE
router.post("/create", async (req, res) => {
  try {
    const projets = await Projets.create(req.body);
    res.status(201).json(projets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//

module.exports = router;