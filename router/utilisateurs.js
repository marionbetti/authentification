const { validation, Utilisateur } = require("../model/utilisateurs");
const express = require("express");
const router = express.Router();

router.get("/", (req, resp) => {
  Utilisateur.find().then(result => {
    resp.send(result);
  });
});

// Postman
// http://localhost:5000/api/utilisateurs
// POST
// { "login" : "test@yahoo.fr" , "mdp" : "azerty" , "role" : "admin"}
router.post("/", (req, resp) => {
  validation(req.body)
    .then(() => {
      // vérifier que les données transmises sont conformes

      // si ok => je passe à l'étape suivante

      // vérifier que le login (email) n'existe pas déjà ?

      // si ok => je passe à l'étape suivante

      // la création du profil

      const utilisateur = new Utilisateur({
        login: req.body.login,
        mdp: req.body.mdp,
        role: req.body.role
      });

      utilisateur.save().then(() => {
        resp.send("nouvel utilisateur créé !");
      });
    })
    .catch(error => {
      resp.status(400).send(error.details[0].message);
    });
});

module.exports = router;
