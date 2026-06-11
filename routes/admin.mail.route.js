const express = require("express");
const router = express.Router();
const Mail = require("../models/mail.model");

// CREATE
router.post("/create", async (req, res) => {
  try {
    const mail = await Mail.create(req.body);
    res.status(201).json(mail);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//

module.exports = router;