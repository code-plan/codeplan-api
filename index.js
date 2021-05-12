/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require("express");
const path = require("path");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "src", "public")));
app.use(morgan("dev"));

app.get("/tasks/", async (req, res) => {
  res.status(200).send([
    {
      id: 1,
      project: "MH Foco",
      content_preview: "Catar coquinho",
      content: "Descrição da task aqui bbbbbb",
      begin_date: "2021-05-04T04:20:30.460Z",
      end_date: "2021-05-04T04:20:42.372Z",
      finish_date: "2021-05-04T04:20:42.372Z",
    },
    {
      id: 2,
      project: "Repecol",
      content_preview: "asdasd",
      content: "Descrição da task aqui aaaaa",
      begin_date: "2021-05-04T04:20:30.460Z",
      end_date: "2021-05-04T04:20:42.372Z",
      finish_date: "2021-05-04T04:20:42.372Z",
    },
    {
      id: 3,
      project: "Repecol",
      content_preview: "Tagggsgggk3",
      content: "Descrição da task aqui ccccc",
      begin_date: "2021-05-04T04:20:30.460Z",
      end_date: "2021-05-04T04:20:42.372Z",
      finish_date: "2021-05-04T04:20:42.372Z",
    },
  ]);
});
app.post("/tasks/1/complete", async (req, res) => {
  res.status(200).send({ completed: true });
});
app.delete("/tasks/1", async (req, res) => {
  res.status(200).send({ deleted: true });
});

app.get("/tasks/comments/", async (req, res) => {
  res.status(200).send([
    {
      id: 1,
      task_preview: "Task1",
      content: "Primeiro comentário aaaaaaaaaaaaaa!",
      created_at: "2021-05-04T04:20:30.460Z",
    },
    {
      id: 2,
      task_preview: "Task1",
      content: "Segundo comentário vvvvvvvvvv!",
      created_at: "2021-05-04T04:20:30.460Z",
    },
    {
      id: 3,
      task_preview: "Task2",
      content: "Primeiro comentário da task 2 asdsadsaddsa!",
      created_at: "2021-05-04T04:20:30.460Z",
    },
    {
      id: 4,
      task_preview: "Task2",
      content: "Segundo comentário da task 2 41as8dsa68d4!",
      created_at: "2021-05-04T04:20:30.460Z",
    },
  ]);
});

app.get("/projects/", async (req, res) => {
  res.status(200).send([
    {
      id: 1,
      name: "Nanana",
      customer_name: "Clever Code",
      customer_document: "222.222.222-22",
      customer_contact: "alex@clevercode.com.br",
      created_at: "2021-05-04T04:20:30.460Z",
    },
    {
      id: 2,
      name: "Algoritmos PDF",
      customer_name: "STS Consulting",
      customer_document: "333.333.333-33",
      customer_contact: "ficticio@stsconsulting.com.br",
      created_at: "2021-05-04T04:20:30.460Z",
    },
  ]);
});

require("./src/route/authorization")(app);
require("./src/route/user")(app);
require("./src/route/webhook")(app);
require("./src/route/client")(app);
require("./src/route/customer")(app);

app.listen(process.env.PORT || 3000, async () => {
  console.log(`Servidor ouvindo na porta ${process.env.PORT || 3000}.`);
});
