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

module.exports = mongoose.model('Curriculum', curriculumSchema);