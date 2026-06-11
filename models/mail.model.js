const mongoose = require("mongoose")

const mailSchema = new mongoose.Schema({

    email: { type: String, unique: true } // Evite partiel doublon et donc deux mail
}, { timestamps: true });

module.exports = mongoose.model('Mail', mailSchema);