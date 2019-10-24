const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const schemaUtilisateur = new mongoose.Schema({
  login: String,
  mdo: String,
  role: String
});

const Utilisateur = mongoose.model("utilisateurs", schemaUtilisateur);

function validationUtilisateur(profil) {
  const schemaUtilisateurJoi = {
    login: Joi.string()
      .email()
      .required(),
    mdp: Joi.string().required(),
    role: Joi.string()
      .min(3)
      .required()
  };
  const schema = Joi.object(schemaUtilisateurJoi);
  return schema.validateAsync(profil);
}

module.exports.validation = validationUtilisateur;
module.exports.Utilisateur = Utilisateur;
