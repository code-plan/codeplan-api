/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const knex = require("./src/database/postgres/index");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "src", "public")));
app.use(morgan("dev"));

require("./src/route/authorization")(app);
require("./src/route/user")(app);
require("./src/route/webhook")(app);
require("./src/route/client")(app);
require("./src/route/customer")(app);

app.listen(process.env.PORT || 3000, async () => {
  console.log(`Servidor ouvindo na porta ${process.env.PORT || 3000} :)`);
});
