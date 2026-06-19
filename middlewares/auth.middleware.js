const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token manquant ou invalide" }); // 401 = échec d'authentification
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Pas compris, explication : req traverse la chaine (du middleware jusqu'a la route final). Vue qu'il se retrouve dans la route final, il est utilisable dans la reponse. Pas besoin de redechiffrer le token. Pas forcement utile ici vue que 1 seul ADMIN mais convention.

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Token invalide ou expiré" }); // 401 = échec d'authentification
  }
}

module.exports = verifyAdmin;