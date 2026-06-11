const mongoose = require("mongoose")

const heroSchema = new mongoose.Schema({

    titre: { type: String },
    valeurs: { type: [String], validate: v => v.length <= 3 },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);