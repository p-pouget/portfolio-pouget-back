const mongoose = require("mongoose")

const mailSchema = new mongoose.Schema({

    email: { type: String, unique: true } // Evite partiel doublon et donc deux mail
}, { timestamps: true });

// virtual = Méthode MONGOOSE. Rajoute le champs id (= _id)
mailSchema.virtual('id').get(function() { 
  return this._id.toHexString(); // HexString convertit en string car _id est object ( .toString() marcherait aussi)
}); // Il s'agit finalement d'un champ qui n'existe pas dans la BDD et qui est générée/calculé au moment de sérialisé l'oject.

module.exports = mongoose.model('Mail', mailSchema);