const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Pas compris, explication : req traverse la chaine (du middleware jusqu'a la route final). Vue qu'il se retrouve dans la route final, il est utilisable dans la reponse. Pas besoin de redechiffrer le token. Pas forcement utile ici vue que 1 seul ADMIN mais convention.

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Token invalide ou expiré" }); // 401 = échec d'authentification
  }
}

module.exports = verifyAdmin;