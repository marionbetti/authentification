// ici c'est ce fichiers qui est appeller lorsque l'on est
// devant une page qui demande  un login /mot de passe

// route a part pour les connexions

// vérifier que les informations sont conformes

// si pas conformes => retour c'est pas conforme
// si conforme => jwt

const express = require("express");
const router = express.Router();
const { Utilisateur } = require("../model/utilisateurs"); // entre cote car il y'en a plusieurs à l'export
const bcrypt = require("bcrypt");
//POSTMAN
//http://localhost:5000/api/connexion
//  POST
// { "login" :" login7@yahoo.fr", "mdp": "azerty"}
// credentials => en anglais couple login + mdp

router.post("/", (req, resp) => {
  // req.body; // contient

  // 1 login qui à été envoyée est conforme => existe dans MONGODB

  Utilisateur.find({ login: req.body.login }).then(result => {
    console.log(result);
    if (result.length === 0)
      return resp.status(400).send("login ou mot de passe incorrect !");

    // 2 mdp qui à été envoyé est conforme
    bcrypt.compare(req.body.mdp, result[0].mdp).then(validPassword => {
      if (!validPassword)
        return resp.status(400).send("login ou mot de passe incorrect !");

      // 3 envoyer jwt
      const token = result[0].generateAuthenToken();
      resp.header("x-auth", token).send("Bienvenu dans le back office ");
      // la norme pour le nom {" x-auth " => x pour démarrer et le nom de l'appli ou n°de version }
    });
  });
});

module.exports = router;
