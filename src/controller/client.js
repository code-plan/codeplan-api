const { isEmpty } = require("lodash");
const bcrypt = require("bcryptjs");
const { randomInt } = require("crypto");

// MongoDB
const Token = require("../model/mongodb/token");
const Client = require("../model/mongodb/client");

// PostgreSQL
const knex = require("../database/postgres/index");

const { send_mail } = require("../config/mailgun");

module.exports = {
  async create_client(req, res) {
    const { username, password } = req.body;
    if (isEmpty(username) || isEmpty(password))
      return res
        .status(400)
        .send({ error: "NOME OU SENHA VAZIO", errorCode: "CLIENT-CON-1" });
    const user = await knex("user").where({ username });
    if (!user[0] || user[0].active == false)
      return res.status(404).send({
        error: "USUARIO NAO ENCONTRADO OU FOI DESATIVADO",
        errorCode: "CLIENT-CON-2",
      });
    if (!(await bcrypt.compare(password, user[0].password)))
      return res
        .status(401)
        .send({ error: "SENHA INCORRETA", errorCode: "CLIENT-CON-3" });
    const profile = await knex("profile").where({ user_id: user[0].id });
    if (!profile[0])
      return res
        .status(404)
        .send({ error: "PERFIL NAO ENCONTRADO", errorCode: "CLIENT-CON-4" });
    let ip = req.ip.split(":");
    const client = await Client.create({
      user_id: user[0].id,
      ip_address: ip[ip.length - 1],
    });
    const code = await Token.create({
      client_id: client._id,
      token: randomInt(9999999),
      type: "confirmation",
    });
    const confirmation_link = `${process.env.PACKAGE_HOST}/clients/${client.id}/${code.token}`;
    send_mail(
      "Confirmação necessária",
      `<!DOCTYPE html><html style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><head><meta name="viewport" content="width=device-width" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Confirmação necessária</title><style type="text/css">img{max-width:100%}body{-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:none;width:100% !important;height:100%;line-height:1.6em}body{background-color:#f6f6f6}@media only screen and (max-width: 640px){body{padding:0 !important}h1{font-weight:800 !important;margin:20px 0 5px !important}h2{font-weight:800 !important;margin:20px 0 5px !important}h3{font-weight:800 !important;margin:20px 0 5px !important}h4{font-weight:800 !important;margin:20px 0 5px !important}h1{font-size:22px !important}h2{font-size:18px !important}h3{font-size:16px !important}.container{padding:0 !important;width:100% !important}.content{padding:0 !important}.content-wrap{padding:10px !important}.invoice{width:100% !important}}</style></head><body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"><table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td><td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top"><div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;"><table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top"><meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" /><table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top"> Olá, ${
        profile[0].name
      }! Referente ao novo client (${client.id}) vinculado à sua conta (IP: ${
        ip[ip.length - 1]
      }). Para confirmá-lo, clique no botão abaixo.</td></tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" itemprop="handler" itemscope itemtype="http://schema.org/HttpActionHandler" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top"> <a href="${confirmation_link}" class="btn-primary" itemprop="url" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda; border-style: solid; border-width: 10px 20px;">Confirmar e-mail</a></td></tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top"> &mdash; Codeplan by Open Build</td></tr></table></td></tr></table><div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;"></body></html>`,
      profile[0].email
    );
    return res.status(200).send({
      client: {
        client_id: client.id,
        client_secret: client.secret,
        confirmed: client.confirmed,
      },
    });
  },
  async delete_client(req, res) {
    const { username, password } = req.body;
    const { client_id } = req.params;

    if (isEmpty(username) || isEmpty(password))
      return res.status(400).send({
        error: "NOME DE USUARIO OU SENHA VAZIO",
        errorCode: "CLIENT-CON-5",
      });
    if (isEmpty(client_id))
      return res
        .status(400)
        .send({ error: "CLIENT ID VAZIO", errorCode: "CLIENT-CON-6" });
    const user = await knex("user").where({ username });
    if (!user[0])
      return res
        .status(404)
        .send({ error: "USUARIO NAO ENCONTRADO", errorCode: "CLIENT-CON-7" });
    if (!(await bcrypt.compare(password, user[0].password)))
      return res
        .status(401)
        .send({ error: "SENHA INCORRETA", errorCode: "CLIENT-CON-8" });
    const client = await Client.findOne({
      _id: client_id,
      user_id: user[0].id,
    });
    if (!client)
      return res.status(400).send({
        error: "CLIENT NAO ENCONTRADO OU NAO PERTENCE AO USUARIO INFORMADO",
        errorCode: "CLIENT-CON-9",
      });
    await Client.updateOne({ _id: client_id }, { enabled: false });
    return res.status(200).send({ client: { id: client_id, enabled: false } });
  },
  async confirm_client(req, res) {
    const { client_id, code } = req.params;
    if (isEmpty(code) || isEmpty(client_id))
      return res.status(400).send({
        error: "ID DO CLIENT OU CODIGO DE CONFIRMACAO VAZIO",
        errorCode: "CLIENT-CON-10",
      });
    const codeDb = await Token.findOne({ token: code });
    if (!codeDb)
      return res
        .status(404)
        .send({ error: "CODIGO NAO ENCONTRADO", errorCode: "CLIENT-CON-11" });
    if (codeDb.client_id != client_id)
      return res.status(403).send({
        error: "CODIGO NAO PERTENCE AO USUARIO INFORMADO",
        errorCode: "CLIENT-CON-12",
      });
    await Client.updateOne({ _id: codeDb.client_id }, { confirmed: true });
    const client = await Client.findById(codeDb.client_id);
    return res.status(200).send({
      client: { id: client.id, confirmed: true },
    });
  },
};
