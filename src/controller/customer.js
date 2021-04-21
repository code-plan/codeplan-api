const { isEmpty, rest } = require("lodash");

// PostgreSQL
const knex = require("../database/postgres/index");

module.exports = {
  async get_customer(req, res) {
    const { customer_id } = req.params;
    if (isEmpty(customer_id))
      return res.status(400).send({
        error: "ID DO CLIENTE VAZIO",
        errorCode: "CST-CON-1",
      });
    const customer = await knex("customer")
      .select("name", "document", "address", "contact")
      .where({ id: customer_id });
    if (isEmpty(customer[0]))
      return res.status(404).send({
        error: "CLIENTE NAO ENCONTRADO",
        errorCode: "CST-CON-2",
      });
    return res.status(200).send({ customer: customer[0] });
  },
  async get_customers(req, res) {
    const customers = await knex("customer").select(
      "name",
      "document",
      "address",
      "contact"
    );
    if (isEmpty(customers))
      return res.status(404).send({
        error: "NENHUM CLIENTE ENCONTRADO",
        errorCode: "CST-CON-3",
      });
    return res.status(200).send({ customers });
  },
  async create_customer(req, res) {
    const { name, document, address, contact } = req.body;
    if (
      isEmpty(name) ||
      isEmpty(document) ||
      isEmpty(address) ||
      isEmpty(contact)
    )
      return res.status(400).send({
        error: "NOME, DOCUMENTO, ENDERECO OU CONTATO VAZIO",
        errorCode: "CST-CON-4",
      });
    const customer = await knex("customer").where({ document });
    if (!isEmpty(customer[0]))
      return res.status(400).send({
        error: "DOCUMENTO JA CADASTRADO EM OUTRO CLIENTE",
        errorCode: "CST-CON-5",
      });
    await knex("customer").insert({ name, document, address, contact });
    const customer_db = await knex("customer").where({ document });
    customer_db[0].created_at = undefined;
    customer_db[0].updated_at = undefined;
    return res.status(200).send({ customer: customer_db[0] });
  },
  async delete_customer(req, res) {
    const { customer_id } = req.params;
    if (isEmpty(customer_id))
      return res.status(400).send({
        error: "ID DO CLIENTE VAZIO",
        errorCode: "CST-CON-6",
      });
    const customer = await knex("customer").where({ id: customer_id });
    if (isEmpty(customer[0]))
      return res.status(404).send({
        error: "CLIENTE NAO ENCONTRADO",
        errorCode: "CST-CON-7",
      });
    await knex("customer").where({ id: customer_id }).del();
    return res.status(200).send({ customer: { id: customer_id } });
  },
  async update_customer(req, res) {
    const { customer_id } = req.params;
    const { name, document, address, contact } = req.body;
    if (isEmpty(customer_id))
      return res.status(400).send({
        error: "ID DO CLIENTE VAZIO",
        errorCode: "CST-CON-8",
      });
    if (
      isEmpty(name) ||
      isEmpty(document) ||
      isEmpty(address) ||
      isEmpty(contact)
    )
      return res.status(400).send({
        error: "NOME, DOCUMENTO, ENDERECO OU CONTATO VAZIO",
        errorCode: "CST-CON-9",
      });
    const customer = await knex("customer").where({ id: customer_id });
    if (isEmpty(customer[0]))
      return res.status(404).send({
        error: "CLIENTE NAO ENCONTRADO",
        errorCode: "CST-CON-10",
      });
    await knex("customer")
      .where({ id: customer_id })
      .update({
        name: name ?? "",
        document: document ?? "",
        address: address ?? "",
        contact: contact ?? "",
      });
    const customer_db = await knex("customer").where({ id: customer_id });
    customer_db[0].created_at = undefined;
    customer_db[0].updated_at = undefined;
    res.status(200).send({ customer: customer_db[0] });
  },
};
