function handleError(res, err) { // Gestion affichage erreurs centralisee
  console.error(err); // Log server pour debug ( pas visible par utilisateur)
  res.status(400).json({ error: "Une erreur est survenue" }); // message standard pour sécurité
}

module.exports = handleError;