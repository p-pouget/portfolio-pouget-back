const mongoose = require("mongoose")

const curriculumSchema = new mongoose.Schema({
    experiences: [{
        titre: { type: String },
        entreprise: { type: String },
        date: { type: String },
        description: { type: String }
    }],
    formations: [{
        diplome: { type: String },
        etablissement: { type: String },
        date: { type: String }
    }],
    competences: {
        hardSkills: [String],
        softSkills: [String],
        langues: [String]
    },
    photo: { type: String }
}, { timestamps: true });

// virtual = Méthode MONGOOSE. Rajoute le champs id (= _id)
curriculumSchema.virtual('id').get(function() { 
  return this._id.toHexString(); // HexString convertit en string car _id est object ( .toString() marcherait aussi)
}); // Il s'agit finalement d'un champ qui n'existe pas dans la BDD et qui est générée/calculé au moment de sérialisé l'oject.

curriculumSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Curriculum', curriculumSchema);