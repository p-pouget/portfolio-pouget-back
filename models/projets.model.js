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

module.exports = mongoose.model('Projet', projetSchema);