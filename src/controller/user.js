const { isEmpty } = require("lodash");
const { randomInt } = require("crypto");
const bcrypt = require("bcryptjs");

// MongoDB
const Token = require("../model/mongodb/token");
const Client = require("../model/mongodb/client");

// PostgreSQL
const knex = require("../database/postgres/index");

const { send_mail } = require("../config/mailgun");

module.exports = {
  async get_user(req, res) {
    const { user_id } = req.params;
    const client_id = req.get("client_id");
    const token = req.get("Authorization");
    if (isEmpty(token) || isEmpty(client_id) || isEmpty(user_id))
      return res.status(400).send({
        error: "TOKEN, CLIENT ID OU ID DO USUARIO VAZIO",
        errorCode: "USER-CON-1",
      });
    const token_db = await Token.findOne({ token });
    const client = await Client.findById(token_db.client_id);
    if (client.id != client_id)
      return res.status(400).send({
        error: "TOKEN NAO PERTENCE AO CLIENT INFORMADO",
        errorCode: "USER-CON-2",
      });
    if (client.user_id != user_id)
      return res.status(400).send({
        error: "USUARIO SOLICITADO NAO PERTENCE AO USUARIO ATIVO",
        errorCode: "USER-CON-3",
      });
    const profile = await knex
      .select(
        "profile.id as profile_id",
        "user.id as user_id",
        "user.username as username",
        "user.level as level",
        "profile.name as name",
        "profile.surname as surname",
        "profile.email as email",
        "profile.phone_number as phone_number",
        "profile.confirmed as confirmed",
        "profile.created_at as created_at",
        "profile.updated_at as updated_at"
      )
      .from("profile")
      .join("user", "user.id", "profile.user_id")
      .where({ "profile.user_id": client.user_id });
    if (isEmpty(profile[0]))
      return res
        .status(404)
        .send({ error: "PERFIL NAO ENCONTRADO", errorCode: "USER-CON-4" });
    return res.status(200).send({ profile: profile[0] });
  },
  async get_users(req, res) {
    const profiles = await knex
      .select(
        "user.username as username",
        "profile.name as name",
        "profile.surname as surname",
        "profile.email as email",
        "user.level as level"
      )
      .from("profile")
      .join("user", "user.id", "profile.user_id");
    if (isEmpty(profiles))
      return res.status(404).send({
        error: "NENHUM PERFIL FOI ENCONTRADO",
        errorCode: "USER-CON-5",
      });
    return res.status(200).send({ profiles });
  },
  async create_user(req, res) {
    const { username, password, name, surname, email, phone_number } = req.body;
    if (
      isEmpty(username) ||
      isEmpty(password) ||
      isEmpty(name) ||
      isEmpty(surname) ||
      isEmpty(email) ||
      isEmpty(phone_number)
    )
      return res.status(400).send({
        error:
          "NOME DE USUARIO, SENHA, NOME, SOBRENOME, E-MAIL OU TELEFONE ESTAO VAZIOS",
        errorCode: "USER-CON-6",
      });
    if (username.length < 5)
      return res.status(400).send({
        error: "NOME DE USUARIO MENOR QUE 5 CARACTERES",
        errorCode: "USER-CON-7",
      });
    if (username.length > 20)
      return res.status(400).send({
        error: "NOME DE USUARIO MAIOR QUE 20 CARACTERES",
        errorCode: "USER-CON-8",
      });
    if (password.length < 8)
      return res.status(400).send({
        error: "SENHA MENOR QUE 8 CARACTERES",
        errorCode: "USER-CON-9",
      });
    if (password.length > 25)
      return res.status(400).send({
        error: "SENHA MAIOR QUE 25 CARACTERES",
        errorCode: "USER-CON-10",
      });
    const users = await knex("user").where({ username });
    const profiles = await knex("profile")
      .where({ email })
      .orWhere({ phone_number });
    if (!isEmpty(users) || !isEmpty(profiles))
      return res.status(400).send({
        error: "UM OU MAIS DADOS ESTAO ANEXADOS A UM USUARIO JA EXISTENTE",
        errorCode: "USER-CON-11",
      });
    await knex("user").insert({
      username,
      password: await bcrypt.hash(password, 10),
    });
    const user = await knex("user").where({ username });
    await knex("profile").insert({
      user_id: user[0].id,
      name,
      surname,
      email,
      phone_number,
      confirmation_code: randomInt(9999999),
    });
    const profile = await knex("profile").where({ user_id: user[0].id });
    const confirmationLink = `${process.env.PACKAGE_HOST}/users/${user[0].id}/${profile[0].confirmation_code}`;
    send_mail(
      "Confirmação necessária",
      `<!DOCTYPE html><html style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><head><meta name="viewport" content="width=device-width" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Confirmação necessária</title><style type="text/css">img{max-width:100%}body{-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:none;width:100% !important;height:100%;line-height:1.6em}body{background-color:#f6f6f6}@media only screen and (max-width: 640px){body{padding:0 !important}h1{font-weight:800 !important;margin:20px 0 5px !important}h2{font-weight:800 !important;margin:20px 0 5px !important}h3{font-weight:800 !important;margin:20px 0 5px !important}h4{font-weight:800 !important;margin:20px 0 5px !important}h1{font-size:22px !important}h2{font-size:18px !important}h3{font-size:16px !important}.container{padding:0 !important;width:100% !important}.content{padding:0 !important}.content-wrap{padding:10px !important}.invoice{width:100% !important}}</style></head><body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"><table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td><td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top"><div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;"><table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top"><meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" /><table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top"> Saudações, ${profile[0].name}! É necessário confirmar seu e-mail antes de entrar para a nossa equipe, clique no botão abaixo para confirmar.</td></tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" itemprop="handler" itemscope itemtype="http://schema.org/HttpActionHandler" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top"> <a href="${confirmationLink}" class="btn-primary" itemprop="url" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda; border-style: solid; border-width: 10px 20px;">Confirmar e-mail</a></td></tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top"> &mdash; Codeplan by Open Build</td></tr></table></td></tr></table><div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;"></body></html>`,
      profile[0].email
    );
    return res.status(200).send({
      user: {
        id: user[0].id,
        username: user[0].username,
        name: profile[0].name,
        surname: profile[0].surname,
        email: profile[0].email,
        phone_number: profile[0].phone_number,
        confirmed: false,
      },
    });
  },
  async confirm_user(req, res) {
    const { user_id, code } = req.params;
    if (isEmpty(code) || isEmpty(user_id))
      return res.status(400).send({
        error: "CODIGO DE CONFIRMACAO OU CODIGO DO USUARIO VAZIO",
        errorCode: "USER-CON-12",
      });
    const profile = await knex("profile").where({ confirmation_code: code });
    if (isEmpty(profile[0]))
      return res
        .status(404)
        .send({ error: "CODIGO NAO ENCONTRADO", errorCode: "USER-CON-13" });
    if (profile[0].user_id != user_id)
      return res.status(403).send({
        error: "CODIGO NAO PERTENCE AO USUARIO INFORMADO",
        errorCode: "USER-CON-14",
      });
    await knex("profile")
      .where({ id: profile[0].id })
      .update({ confirmed: true });
    const user = await knex("user").where({ id: profile[0].user_id });
    return res.status(200).send({
      user: { username: user[0].username, confirmed: true },
    });
  },
  async update_user(req, res) {
    const {
      user_id,
      username,
      password,
      name,
      surname,
      email,
      phone_number,
    } = req.body;
    if (isEmpty(user_id) || isEmpty(username) || isEmpty(password))
      return res.status(400).send({
        error: "ID, NOME DE USUARIO OU SENHA VAZIO",
        errorCode: "USER-CON-15",
      });
    const user = await knex("user").where({ id: user_id });
    if (isEmpty(user[0]))
      return res.status(404).send({
        error: "USUARIO NAO ENCONTRADO",
        errorCode: "USER-CON-16",
      });
    if (user[0].username !== username)
      return res.status(403).send({
        error: "LOGIN NAO PERTENCE AO USUARIO INFORMADO",
        errorCode: "USER-CON-17",
      });
    if (!(await bcrypt.compare(password, user[0].password)))
      return res.status(401).send({
        error: "SENHA INCORRETA",
        errorCode: "USER-CON-18",
      });
    const profile = await knex("profile").where({ user_id });
    if (isEmpty(profile[0]))
      return res.status(404).send({
        error: "USUARIO NAO ENCONTRADO",
        errorCode: "USER-CON-19",
      });
    await knex("profile")
      .where({ id: profile[0].id })
      .update({
        name: name ?? "",
        surname: surname ?? "",
        email: email ?? "",
        phone_number: phone_number ?? "",
      });
    const updatedProfile = await knex("profile").where({ id: profile[0].id });
    return res.status(200).send({ user: updatedProfile });
  },
  async delete_user(req, res) {
    const { user_id } = req.params;
    const client_id = req.get("client_id");
    const token = req.get("Authorization");
    if (isEmpty(token) || isEmpty(client_id) || isEmpty(user_id))
      return res.status(400).send({
        error: "TOKEN, CLIENT ID OU ID DO USUARIO VAZIO",
        errorCode: "USER-CON-20",
      });
    const token_db = await Token.findOne({ token });
    const client = await Client.findById(token_db.client_id);
    if (client.id != client_id)
      return res.status(400).send({
        error: "TOKEN NAO PERTENCE AO CLIENT INFORMADO",
        errorCode: "USER-CON-21",
      });
    if (client.user_id != user_id)
      return res.status(400).send({
        error: "USUARIO SOLICITADO NAO PERTENCE AO USUARIO ATIVO",
        errorCode: "USER-CON-22",
      });
    await knex("user").where({ id: user_id }).update({ active: false });
    const user = await knex("user").where({ id: user_id });
    return res
      .status(200)
      .send({ user: { username: user[0].username, active: user[0].active } });
  },
};
