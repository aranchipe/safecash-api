require("dotenv").config();
const cors = require("cors");
const express = require("express");
const rotas = require("./rotas");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Configurar a origem permitida para acessar a API
  })
);
app.use(rotas);
app.listen(process.env.PORT || 3334);
