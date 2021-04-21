/* eslint-disable camelcase */
const { isEmpty } = require("lodash");
const { send_mail } = require("../config/mailgun");
// eslint-disable-next-line no-unused-vars
const { send_sms } = require("../config/twilio");

// MongoDB
const Webhook = require("../model/mongodb/webhook");

// PostgreSQL
const knex = require("../database/postgres/index");

module.exports = {
  async deployment(req, res) {
    const { project_id, channel, profile_id } = req.params;
    if (isEmpty(profile_id) || isEmpty(project_id))
      return res.status(400).send({
        error: "ID DO PERFIL, CANAL OU ID DO PROJETO VAZIO",
        errorCode: "WEH-CON-1",
      });
    const profile = await knex("profile").where({ id: profile_id });
    if (isEmpty(profile[0]))
      return res
        .status(404)
        .send({ error: "PERFIL NAO ENCONTRADO", errorCode: "WEH-CON-2" });
    const project = await knex("project").where({ id: project_id });
    if (isEmpty(project[0]))
      return res
        .status(404)
        .send({ error: "PROJETO NAO ENCONTRADO", errorCode: "WEH-CON-3" });
    const profileActive = await knex
      .select("*")
      .from("profile")
      .join("team_member", "profile.id", "team_member.profile_id")
      .join("team", "team_member.team_id", "team.id")
      .join("project_team", "team.id", "project_team.team_id")
      .join("project", "project_team.project_id", "project.id")
      .where({ "profile.id": profile_id });
    if (isEmpty(profileActive[0]))
      return res.status(403).send({
        error: "PERFIL NAO ESTA VINCULADO AO PROJETO INFORMADO",
        errorCode: "WEH-CON-4",
      });
    let channel_name = "";
    switch (channel) {
      case "dev":
        channel_name = "Desenvolvimento";
        break;
      case "homolog":
        channel_name = "Homologação";
        break;
      case "prod":
        channel_name = "Produção";
        break;
      default:
        channel_name = "Indefinido";
        break;
    }
    const deploy_message = `Olá, ${
      profile[0].name
    }. Deploy realizado em ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()} no projeto ${
      project[0].name
    }, canal: ${channel_name}.`;
    send_mail(
      "Deploy realizado",
      `<!DOCTYPE html><html style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><head><meta name="viewport" content="width=device-width" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Confirmação necessária</title><style type="text/css">img{max-width:100%}body{-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:none;width:100% !important;height:100%;line-height:1.6em}body{background-color:#f6f6f6}@media only screen and (max-width: 640px){body{padding:0 !important}h1{font-weight:800 !important;margin:20px 0 5px !important}h2{font-weight:800 !important;margin:20px 0 5px !important}h3{font-weight:800 !important;margin:20px 0 5px !important}h4{font-weight:800 !important;margin:20px 0 5px !important}h1{font-size:22px !important}h2{font-size:18px !important}h3{font-size:16px !important}.container{padding:0 !important;width:100% !important}.content{padding:0 !important}.content-wrap{padding:10px !important}.invoice{width:100% !important}}</style></head><body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"><table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td><td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top"><div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;"><table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top"><meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" /><table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top"> ${deploy_message}</td><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top"> &mdash; Codeplan by Open Build</td></tr></table></td></tr></table><div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;"></body></html>`,
      profile[0].email
    );
    await Webhook.create({
      receiver: profile[0].email,
      title: "Deploy realizado",
      content: deploy_message,
      type: "email",
      reason: "deploy",
    });
    // send_sms(deploy_message, profile[0].phone_number);
    // await Webhook.create({
    //   receiver: profile[0].phone_number,
    //   title: "Deploy realizado",
    //   content: deploy_message,
    //   type: "sms",
    //   reason: "deploy",
    // });
    return res.status(200).send({ message: deploy_message });
  },
};
