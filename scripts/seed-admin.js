// SCRIPT création admin (n'appartient pas a express ais a node.js)
// En local : npm run seed
// En prod : lancé automatiquement par le server (npm start : dans package.json) avant le serveur Express
// !! Ne pas oublier de rentrer les variables d'env. avant deploiement

require("dotenv").config(); 
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  // Verification si déja cree
  const exist = await UserModel.findOne({ email: process.env.ADMIN_EMAIL });
  if (exist) {
    console.log("Admin existe déja");
    process.exit(0);             // code 0 = succès
  }

  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await UserModel.create({
    username: process.env.ADMIN_USERNAME,
    email:    process.env.ADMIN_EMAIL,
    password: hash,
  });

  console.log(`Admin ("${process.env.ADMIN_USERNAME}") créé avec succès.`);
  process.exit(0); // code 0 = succès
}

seedAdmin().catch((err) => {
  console.error("Erreur script seed-admin :", err.message);
  process.exit(1); // code 1 = erreur
});