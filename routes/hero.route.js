const express = require("express");
const router = express.Router();
const Hero = require("../models/hero.model");

// GET > REACT FRONT

router.get("/", async (req, res) => {
  try {
    const hero = await Hero.findOne(); // findOne() renvoi un objet unique et non un tableau comme find()
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET > REACT ADMIN

router.get("/all", async (req, res) => {
  try {
    const hero = await Hero.findOne(); // findOne() renvoi l'objet unique (Hero) et non un tableau comme find()
    if (!hero) return res.status(404).json({ error: "Informations introuvable" });

    const data = [{ // EMPAQUETAGE DANS TABLEAU + INSERTION id: POUR REACT ADMIN car parametrage du datagrid = getlist obligatoire
      id: hero.id,
      titre: hero.titre,
      valeurs: hero.valeurs,
      description: hero.description
    }];

    // Pour envoyer dans le HEADER (Donc a react admin) le nombre de resultat (gestion pagination)
    res.set('Content-Range', `hero 0-${data.length}/${data.length}`) // Nombre de resultat stocker dans content-Range. data.length pour entretien futur ( actuel = 1)
    res.set('Access-Control-Expose-Headers', 'Content-Range') // Autorise content-range dans le header

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// les routes spécifiques/fixes toujours avant les routes dynamiques (:param) car ces dernieres attrape tout. Express ne fait aucun tri par "précision", il prend juste la première qui matche.

router.get("/all/:id", async (req, res) => {
  try {
    const hero = await Hero.findOne(); // findOne() renvoi l'objet unique (Hero) et non un tableau comme find()
    if (!hero) return res.status(404).json({ error: "Informations introuvable" });

    res.json({ // Structuration en object pour /:id. Nécéssaire pour getOne(DataGrid) React Admin
      id: hero.id,
      titre: hero.titre,
      valeurs: hero.valeurs,
      description: hero.description
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;