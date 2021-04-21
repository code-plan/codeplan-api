const jwt = require("jsonwebtoken");
const { isEmpty } = require("lodash");

// MongoDB
const Token = require("../model/mongodb/token");
const Client = require("../model/mongodb/client");

// PostgreSQL
const knex = require("../database/postgres/index");

const generate_token = async (client_id, params = {}) => {
  const token = jwt.sign(params, process.env.JWT_SECRET, { expiresIn: "1h" });
  const tokenCreated = await Token.create({ client_id, token, type: "jwt" });
  return tokenCreated.token;
};

module.exports = {
  async get_token(req, res) {
    const client_id = req.get("client_id");
    const client_secret = req.get("client_secret");

    if (isEmpty(client_id) || isEmpty(client_secret))
      return res.status(400).send({
        error: "CLIENT ID OU CLIENT SECRET VAZIO",
        errorCode: "AUTH-CON-1",
      });
    const client = await Client.findById(client_id);
    if (isEmpty(client))
      return res
        .status(404)
        .send({ error: "CLIENT NAO ENCONTRADO", errorCode: "AUTH-CON-2" });
    if (client.enabled == false)
      return res.status(403).send({
        error: "CLIENT NAO AUTORIZADO PARA LOGIN",
        errorCode: "AUTH-CON-3",
      });
    if (client.confirmed == false)
      return res.status(403).send({
        error: "CLIENT NAO CONFIRMADO, VERIFIQUE SEU E-MAIL",
        errorCode: "AUTH-CON-4",
      });
    if (client_secret != client.secret)
      return res
        .status(401)
        .send({ error: "CLIENT SECRET INCORRETA", errorCode: "AUTH-CON-5" });
    const user = await knex("user").where({ id: client.user_id });
    if (user[0].active == false)
      return res
        .status(400)
        .send({ error: "USUARIO FOI DESATIVADO", errorCode: "AUTH-CON-6" });
    res.send({
      profile: user[0].username,
      token: await generate_token(client.id, { id: user[0].id }),
    });
  },
};
