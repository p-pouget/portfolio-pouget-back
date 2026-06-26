const mongoose = require("mongoose")

const heroSchema = new mongoose.Schema({

    titre: { type: String },
    valeurs: { type: [String], validate: v => v.length <= 3 },
    description: { type: String }
}, { timestamps: true });

// virtual = Méthode MONGOOSE. Rajoute le champs id (= _id)
heroSchema.virtual('id').get(function() { 
  return this._id.toHexString(); // HexString convertit en string car _id est object ( .toString() marcherait aussi)
}); // Il s'agit finalement d'un champ qui n'existe pas dans la BDD et qui est générée/calculé au moment de sérialisé l'oject.

module.exports = mongoose.model('Hero', heroSchema);