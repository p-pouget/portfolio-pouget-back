const jwt = require("jsonwebtoken");
// Pas de handleError ici pour garder error 401 ( erreur auth) donc message generaliste

function verifyAdmin(req, res, next) {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authentification requise" }); // 401 = échec d'authentification
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Pas compris, explication : req traverse la chaine (du middleware jusqu'a la route final). Vue qu'il se retrouve dans la route final, il est utilisable dans la reponse. Pas besoin de redechiffrer le token. Pas forcement utile ici vue que 1 seul ADMIN mais convention.

    next();
  } catch (err) {
    console.error(err) // Pour log serveur
    return res.status(401).json({ message: "Authentification requise" }); // 401 = échec d'authentification
  }
}

module.exports = verifyAdmin;