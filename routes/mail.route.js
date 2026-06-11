const express = require("express");
const router = express.Router();
const Mail = require("../models/mail.model");

router.get("/", async (req, res) => {
  try {
    const mail = await Mail.findOne(); // findOne() renvoi un objet unique et non un tableau comme find()
    res.json(mail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;