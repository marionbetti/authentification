const { validation, Utilisateur } = require("../model/utilisateurs");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

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
      Utilisateur.find({ login: req.body.login }).then(result => {
        //console.log(result);
        if (result.length !== 0)
          return resp.status(400).send("login existe déjà !");
        // si ok => je passe à l'étape suivante
        // la création du profil

        //Crypter le mot de passe
        // ralentir le hacker pour le vol d'identité

        bcrypt.genSalt(10).then(salt => {
          bcrypt.hash(req.body.mdp, salt).then(hashedPassword => {
            //créer le profil avec un mot de passe hashé !
            const utilisateur = new Utilisateur({
              login: req.body.login,
              mdp: hashedPassword,
              role: req.body.role
            });

            utilisateur.save().then(() => {
              resp.send("nouvel utilisateur créé !");
            });
          });
        });
      });
    })
    .catch(error => {
      resp.status(400).send(error.details[0].message);
    });
});

module.exports = router;
