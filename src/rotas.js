const express = require("express");
const {
  registerBilling,
  listBillings,
  attBilling,
  delBilling,
} = require("./controllers/billings");
const { signin, signup, userDetail } = require("./controllers/users");
const { checkSignin } = require("./middlewares/checkSignin");
const {
  registerSaved,
  attSaved,
  listSaved,
  deleteSaved,
} = require("./controllers/guardados");
const {
  registerDinheiroAtual,
  listDinheiroAtual,
  attDinheiroAtual,
} = require("./controllers/dinheiroAtual");

const rotas = express();

rotas.post("/signin", signin);
rotas.post("/signup", signup);

rotas.use(checkSignin);

rotas.get("/user", userDetail);

rotas.post("/registros", registerBilling);
rotas.get("/registros", listBillings);
rotas.put("/registro/:id", attBilling);
rotas.delete("/registro/:id", delBilling);

rotas.post("/guardados", registerSaved);
rotas.put("/guardados/:id", attSaved);
rotas.get("/guardados", listSaved);
rotas.delete("/guardados/:id", deleteSaved);

rotas.post("/dinheiroAtual", registerDinheiroAtual);
rotas.get("/dinheiroAtual", listDinheiroAtual);
rotas.put("/dinheiroAtual/:id", attDinheiroAtual);

module.exports = rotas;
