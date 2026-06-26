const mongoose = require("mongoose")

const projetSchema = new mongoose.Schema({
  titre: { type: String },
  stack: { type: [String]},
  description: { type: String },
  lienGithub: { type: String },
  lienDeploiement: { type: String },
  img: { type: String },
  selected: { type: Boolean, default: false }
}, { timestamps: true });

// virtual = Méthode MONGOOSE. Rajoute le champs id (= _id)
projetSchema.virtual('id').get(function() { 
  return this._id.toHexString(); // HexString convertit en string car _id est object ( .toString() marcherait aussi)
}); // Il s'agit finalement d'un champ qui n'existe pas dans la BDD et qui est générée/calculé au moment de sérialisé l'oject.

projetSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Projet', projetSchema);