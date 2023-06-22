require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rotas = require("./rotas");
const app = express();

app.use(express.json());
app.use(cors());
/* app.use(
  "/signin",
  createProxyMiddleware({
    target: "https://safecash.cyclic.app",
    changeOrigin: true,
    secure: false,
    headers: {
      "Access-Control-Allow-Origin": "*", // Defina a origem permitida corretamente
    },
  })
); */
app.use(rotas);
app.listen(process.env.PORT || 3334);
