const express = require("express");
const router = express.Router();
const Mail = require("../models/mail.model");
const verifyAdmin = require("../middlewares/auth.middleware");

router.use(verifyAdmin); // router l'utilise pour chaque route dans le fichier

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