const jwt = require("jsonwebtoken");
const { isEmpty } = require("lodash");

// MongoDB
const Token = require("../model/mongodb/token");
const Client = require("../model/mongodb/client");

// PostgreSQL
const knex = require("../database/postgres/index");

module.exports = async (req, res, next) => {
  const client_id = req.get("client_id");
  const client_secret = req.get("client_secret");
  const token = req.get("Authorization");

  if (isEmpty(token))
    return res
      .status(400)
      .send({ error: "TOKEN VAZIO", errorCode: "AUTH-MID-1" });
  if (isEmpty(client_id) || isEmpty(client_secret))
    return res.status(400).send({
      error: "CLIENT ID OU CLIENT SECRET VAZIO",
      errorCode: "AUTH-MID-2",
    });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err)
      return res
        .status(401)
        .send({ error: "TOKEN INVALIDO", errorCode: "AUTH-MID-3" });
    const client = await Client.findById(client_id);
    if (decoded.id !== client.user_id)
      return res.status(400).send({
        error: "TOKEN NAO PERTENCE AO USUARIO DESCENDENTE DO CLIENT",
        errorCode: "AUTH-MID-4",
      });
    if (!client)
      return res
        .status(400)
        .send({ error: "CLIENT NAO ENCONTRADO", errorCode: "AUTH-MID-5" });
    if (client.secret !== client_secret)
      return res
        .status(401)
        .send({ error: "CLIENT SECRET INCORRETA", errorCode: "AUTH-MID-6" });
    if (client.enabled === false)
      return res.status(403).send({
        error: "CLIENT NAO AUTORIZADO PARA LOGIN",
        errorCode: "AUTH-MID-7",
      });
    const profile = await knex("profile").where({ user_id: client.user_id });
    const user = await knex("user").where({ id: client.user_id });
    if (isEmpty(profile[0]) || isEmpty(user[0]))
      return res.status(404).send({
        error: "PERFIL NAO ENCONTRADO",
        errorCode: "AUTH-MID-8",
      });
    if (user[0].active == false)
      return res.status(400).send({
        error: "USUARIO FOI DESATIVADO",
        errorCode: "AUTH-MID-9",
      });
    if (profile[0].confirmed === false)
      return res.status(403).send({
        error: "NECESSARIA A CONFIRMACAO DO PERFIL POR EMAIL",
        errorCode: "AUTH-MID-10",
      });
    next();
  });
};
