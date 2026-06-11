const express = require("express");
const router = express.Router();
const Hero = require("../models/hero.model");

router.get("/", async (req, res) => {
  try {
    const hero = await Hero.findOne(); // findOne() renvoi un objet unique et non un tableau comme find()
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;