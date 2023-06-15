const knex = require("../database/connection");

const registerDinheiroAtual = async (req, res) => {
  const { user } = req;
  const { value, month } = req.body;

  if (!value || !month) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios" });
  }

  try {
    const userFound = await knex("users").where({ id: user.id });

    if (userFound.length === 0) {
      return res.status(404).json({ mensagem: "usuário não encontrado" });
    }

    const savedFound = await knex("dinheiro_atual").where({
      user_id: user.id,
      month,
    });

    if (savedFound.length !== 0) {
      return res
        .status(400)
        .json({ mensagem: "Já existe dinheiro atual nesse mês" });
    }

    const saveRegistered = await knex("dinheiro_atual").insert({
      value,
      month,
      user_id: user.id,
    });

    if (saveRegistered.length === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível registrar o dinheiro atual" });
    }

    return res.status(200).json("Dinheiro atual registrado com sucesso");
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listDinheiroAtual = async (req, res) => {
  const { user } = req;

  try {
    const userFound = await knex("users").where({ id: user.id });
    if (userFound.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const dinheiroAtual = await knex("dinheiro_atual").where({
      user_id: user.id,
    });
    return res.status(200).json(dinheiroAtual);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const attDinheiroAtual = async (req, res) => {
  const { user } = req;
  const { value, month } = req.body;
  const { id } = req.params;

  if (!value || !month) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios" });
  }
  try {
    const userFound = await knex("users").where({ id: user.id });
    if (userFound.length === 0) {
      return res.status(404).json({ mensagem: "usuário não encontrado" });
    }

    const saveFound = await knex("dinheiro_atual").where({
      id,
      user_id: user.id,
    });
    if (saveFound.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Dinheiro atual não encontrado" });
    }

    const attSave = await knex("dinheiro_atual")
      .update({
        value,
        month,
        user_id: user.id,
      })
      .where({ id, user_id: user.id });

    if (attSave.length === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível editar o dinheiro atual" });
    }

    return res
      .status(200)
      .json({ mensagem: "Dinheiro atual atualizado com sucesso" });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  registerDinheiroAtual,
  listDinheiroAtual,
  attDinheiroAtual,
};
