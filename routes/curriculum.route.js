const express = require("express");
const router = express.Router();
const Curriculum = require("../models/curriculum.model");
const handleError = require("../utils/handleError");

// GET > REACT FRONT

router.get("/", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOne(); // findOne() renvoi un objet unique et non un tableau comme find()
    res.json(curriculum);
  } catch (err) {
    handleError(res, err);
  }
});

// GET > REACT ADMIN

router.get("/competences", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOne(); // findOne() renvoi l'objet unique (Curriculum) et non un tableau comme find()
    if (!curriculum) return handleError(res);

    const data = [{ // EMPAQUETAGE DANS TABLEAU + INSERTION id: POUR REACT ADMIN car parametrage du datagrid = getlist obligatoire
      id: curriculum.id, // Hack = attribution id via curriculum.id ( pas d'attribution via virtual id)
      hardSkills: curriculum.competences.hardSkills,
      softSkills: curriculum.competences.softSkills,
      langues: curriculum.competences.langues
    }];

    // Pour envoyer dans le HEADER (Donc a react admin) le nombre de resultat (gestion pagination)
    res.set('Content-Range', `competences 0-${data.length}/${data.length}`) // Nombre de resultat stocker dans content-Range. data.length pour entretien futur ( actuel = 1)
    res.set('Access-Control-Expose-Headers', 'Content-Range') // Autorise content-range dans le header

    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/experiences", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOne();
    if (!curriculum) return handleError(res);

    const data = curriculum.experiences

    // Pour envoyer dans le HEADER (Donc a react admin) le nombre de resultat (gestion pagination)
    res.set('Content-Range', `experiences 0-${data.length}/${data.length}`) // Nombre de resultat stocker dans content-Range.
    res.set('Access-Control-Expose-Headers', 'Content-Range') // Autorise content-range dans le header

    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/formations", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOne();
    if (!curriculum) return handleError(res);

    const data = curriculum.formations

    // Pour envoyer dans le HEADER (Donc a react admin) le nombre de resultat (gestion pagination)
    res.set('Content-Range', `formations 0-${data.length}/${data.length}`) // Nombre de resultat stocker dans content-Range
    res.set('Access-Control-Expose-Headers', 'Content-Range') // Autorise content-range dans le header

    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/photoUrl", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOne();
    if (!curriculum) return handleError(res);

    const data = [{ // EMPAQUETAGE DANS TABLEAU + INSERTION id: POUR REACT ADMIN car parametrage du datagrid = getlist obligatoire
      id: curriculum.id, // Hack = attribution id via curriculum.id ( pas d'attribution via virtual id)
      photo: curriculum.photo
    }];

    // Pour envoyer dans le HEADER (Donc a react admin) le nombre de resultat (gestion pagination)
    res.set('Content-Range', `photo 0-${data.length}/${data.length}`) // Nombre de resultat stocker dans content-Range. data.length pour entretien futur ( actuel = 1)
    res.set('Access-Control-Expose-Headers', 'Content-Range') // Autorise content-range dans le header

    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
});

// GET/:id REACT ADMIN + FRONT ( experiences only )
// les routes spécifiques/fixes toujours avant les routes dynamiques (:param) car ces dernieres attrape tout. Express ne fait aucun tri par "précision", il prend juste la première qui match.
// findOne (plutot que findByid) car on cherche un id dans un subdocument et non a la racine. On charge alors le parents pour naviguer dedans. Donc travail coté serveur plutot que dans MongoDB.

router.get("/competences/:id", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOne(); // findOne() renvoi l'objet unique (Curriculum) et non un tableau comme find()
    if (!curriculum) return handleError(res);

    res.json({ // Structuration en object pour /:id. Nécéssaire pour getOne(DataGrid) React Admin
      id: curriculum.id,
      hardSkills: curriculum.competences.hardSkills,
      softSkills: curriculum.competences.softSkills,
      langues: curriculum.competences.langues
    });
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/experiences/:id", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOne(); // findOne() renvoi l'objet unique (Curriculum) et non un tableau comme find()
    if (!curriculum) return handleError(res);

    const experience = curriculum.experiences.id(req.params.id); // .id = methode Mongoose pour les subdocoments c'est à dire deja en mémoire
    if (!experience) return handleError(res);
    res.json(experience);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/formations/:id", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOne(); // findOne() renvoi l'objet unique (Curriculum) et non un tableau comme find()
    if (!curriculum) return handleError(res);

    const formation = curriculum.formations.id(req.params.id); // .id = methode Mongoose pour les subdocoments c'est à dire deja en mémoire
    if (!formation) return handleError(res);
    res.json(formation);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/photoUrl/:id", async (req, res) => {
  try {
    const curriculum = await Curriculum.findOne(); // findOne() renvoi l'objet unique (Curriculum) et non un tableau comme find()
    if (!curriculum) return handleError(res);

    res.json({ // Structuration en object pour /:id. Nécéssaire pour getOne(DataGrid) React Admin
      id: curriculum.id,
      photo: curriculum.photo
    });
  } catch (err) {
    handleError(res, err);
  }
});


module.exports = router;