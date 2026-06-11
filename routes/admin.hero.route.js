const express = require("express");
const router = express.Router();
const Hero = require("../models/hero.model");

// CREATE
router.post("/create", async (req, res) => {
  try {
    const hero = await Hero.create(req.body);
    res.status(201).json(hero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//

module.exports = router;