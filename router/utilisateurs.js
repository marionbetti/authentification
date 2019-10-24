const { validation, Utilisateur } = require("../model/utilisateurs");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

router.get("/", (req, resp) => {
  Utilisateur.find().then(result => {
    const resultModif = [];
    for (let i = 0; i < result.length; i++) {
      resultModif[i] = _.pick(result[i], ["id", "login", "role"]);
    }
    resp.send(resultModif);
  });
});
// Postman
// http://localhost:5000/api/utilisateurs
// POST
// { "login" : "test@yahoo.fr" , "mdp" : "azerty" , "role" : "admin"}
router.post("/", (req, resp) => {
  // 1
  validation(req.body)
    .then(() => {
      // 2 si ok => je passe à l'étape suivante
      // vérifier que les données transmises sont conformes

      // vérifier que le login (email) n'existe pas déjà ?
      Utilisateur.find({ login: req.body.login }).then(result => {
        // 3 soit j'ai ...
        if (result.length !== 0)
          return resp.status(400).send("login existe déjà !");
        // si ok => je passe à l'étape suivante
        // la création du profil

        //Crypter le mot de passe
        // ralentir le hacker pour le vol d'identité
        // 5 req.body.mdp que je salt => hashedPassword
        bcrypt.genSalt(10).then(salt => {
          bcrypt.hash(req.body.mdp, salt).then(hashedPassword => {
            // 6 créer le profil avec un mot de passe hashé !
            const utilisateur = new Utilisateur({
              login: req.body.login,
              mdp: hashedPassword,
              role: req.body.role
            });
            // 7 create mon profil
            utilisateur.save().then(nouveauCompte => {
              // 8 retourner le nouveau compte avec {"_id": "foiiohohlb"}
              const result = _.pick(nouveauCompte, ["_id", "role"]);
              resp.send(result);
            });
          });
        });
      });
    })
    .catch(error => {
      // 2 si ok
      resp.status(400).send(error.details[0].message);
    });
});

module.exports = router;
