const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const schemaUtilisateur = new mongoose.Schema({
  login: String,
  mdp: String,
  role: {
    type: String,
    default: "traducteur",
    enum: ["admin", "traducteur", "redacteur"] // pour ne donner que c'est valeur
    // pas possible de créer autre choses que "admin", "traducteur", "redacteur"
  }
});

// payload pour générer des tokens
schemaUtilisateur.methods.generateAuthenToken = function() {
  const payload = {
    _id: this._id,
    role: this.role
  };

  const token = jwt.sign(payload, "secret");
  return token; // chaine de caractere cryptée
};

const Utilisateur = mongoose.model("utilisateurs", schemaUtilisateur);

function validationUtilisateur(profil) {
  const schemaUtilisateurJoi = {
    login: Joi.string()
      .email()
      .required(),
    mdp: Joi.string().required()
    // role: Joi.string()
    //   .min(3)
    //   .required()
    // plus besoin car on a prédéfini un role == traducteur
  };
  const schema = Joi.object(schemaUtilisateurJoi);
  return schema.validateAsync(profil);
}

module.exports.validation = validationUtilisateur;
module.exports.Utilisateur = Utilisateur;
