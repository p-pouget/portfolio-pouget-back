const express = require("express");
const router = express.Router();
const Curriculum = require("../models/curriculum.model");
const verifyAdmin = require("../middlewares/auth.middleware");

router.use(verifyAdmin); // router l'utilise pour chaque route dans le fichier

// CREATE
router.post("/create", async (req, res) => {
  try {
    const curriculum = await Curriculum.create(req.body);
    res.status(201).json(curriculum);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//

module.exports = router;