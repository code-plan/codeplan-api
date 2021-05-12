const { isEmpty, rest } = require("lodash");

// PostgreSQL
const knex = require("../database/postgres/index");

module.exports = {
  async get_project(req, res) {
    const { project_id } = req.params;
    if (isEmpty(project_id))
      return res
        .status(400)
        .send({ error: "ID DO PROJETO VAZIO", errorCode: "PRJ-CON-1" });
    let project = await knex("project").where({ id: project_id });
    if (isEmpty(project[0]))
        return res.status(404).send({error: "PROJETO NAO ENCONTRADO", errorCode: "PRJ-CON-2"});
    return res.status(200).send({ project: project[0] })
  },
  get_projects(req, res) {},
  create_project(req, res) {},
  update_project(req, res) {},
  delete_project(req, res) {},
};
