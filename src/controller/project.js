const { isEmpty, rest } = require("lodash");

// MongoDB
const Token = require("../model/mongodb/token");
const Client = require("../model/mongodb/client");

// PostgreSQL
const knex = require("../database/postgres/index");

module.exports = {
  async get_project(req, res) {
    const { project_id } = req.params;
    const token = req.get("Authorization");
    if (isEmpty(project_id))
      return res
        .status(400)
        .send({ error: "ID DO PROJETO VAZIO", errorCode: "PRJ-CON-1" });
    let project = await knex("project").where({ id: project_id });
    if (isEmpty(project[0]))
      return res
        .status(404)
        .send({ error: "PROJETO NAO ENCONTRADO", errorCode: "PRJ-CON-2" });
    let token_db = Token.findOne({token});
    if (isEmpty(token_db))
      return res
        .status(404)
        .send({ error: "TOKEN NAO ENCONTRADO", errorCode: "PRJ-CON-3" });
    let client_db = Client.findOne({_id: token_db.client_id});
    if (isEmpty(client_db))
      return res
        .status(404)
        .send({ error: "CLIENT NAO ENCONTRADO", errorCode: "PRJ-CON-4" });
    let profile_db = await knex("profile").where({user_id: client_db.user_id});
    if (isEmpty(profile_db[0]))
      return res
        .status(404)
        .send({ error: "PERFIL NAO ENCONTRADO", errorCode: "PRJ-CON-5" });
    return res.status(200).send({ project: project[0] });
  },
  get_projects(req, res) {},
  create_project(req, res) {},
  update_project(req, res) {},
  delete_project(req, res) {},
};
