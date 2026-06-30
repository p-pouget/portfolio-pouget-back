const express = require("express");
const router = express.Router();
const Mail = require("../models/mail.model");
const handleError = require("../utils/handleError");

// GET > REACT FRONT

router.get("/", async (req, res) => {
  try {
    const mail = await Mail.findOne(); // findOne() renvoi un objet unique et non un tableau comme find()
    res.json(mail);
  } catch (err) {
    handleError(res, err);
  }
});

// GET > REACT ADMIN

router.get("/contact", async (req, res) => {
  try {
    const mail = await Mail.findOne(); // findOne() renvoi l'objet unique (Mail) et non un tableau comme find()
    if (!mail) return handleError(res);

    const data = [{ // EMPAQUETAGE DANS TABLEAU + INSERTION id: POUR REACT ADMIN car parametrage du datagrid = getlist obligatoire
      id: mail.id,
      email: mail.email,
    }];

    // Pour envoyer dans le HEADER (Donc a react admin) le nombre de resultat (gestion pagination)
    res.set('Content-Range', `mail 0-${data.length}/${data.length}`) // Nombre de resultat stocker dans content-Range. data.length pour entretien futur ( actuel = 1)
    res.set('Access-Control-Expose-Headers', 'Content-Range') // Autorise content-range dans le header

    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
});

// les routes spécifiques/fixes toujours avant les routes dynamiques (:param) car ces dernieres attrape tout. Express ne fait aucun tri par "précision", il prend juste la première qui matche.

router.get("/contact/:id", async (req, res) => {
  try {
    const mail = await Mail.findOne(); // findOne() renvoi l'objet unique (Mail) et non un tableau comme find()
    if (!mail) return handleError(res);

    res.json({ // Structuration en object pour /:id. Nécéssaire pour getOne(DataGrid) React Admin
      id: mail.id,
      email: mail.email,
    });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;