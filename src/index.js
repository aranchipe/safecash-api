require("dotenv").config();
const postgres = require("postgres");
const cors = require("cors");
const express = require("express");
/* const { createProxyMiddleware } = require("http-proxy-middleware"); */
const rotas = require("./rotas");
const app = express();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: "require" });

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();
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
