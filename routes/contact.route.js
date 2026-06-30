const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const handleError = require("../utils/handleError");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ADRESS,
    pass: process.env.GMAIL_PASS,
  },
});

router.post("/", async (req, res) => {
  const { nom, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"Formulaire Contact" <${process.env.GMAIL_ADRESS}>`,
      to: process.env.GMAIL_ADRESS,
      replyTo: email,
      subject: `Message de ${nom}`,
      html: `<p><strong>De :</strong> ${nom} (${email})</p><p>${message}</p>`,
    });

    res.status(200).json({ message: "Email envoyé." });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;