const knex = require("../database/connection");

const registerSaved = async (req, res) => {
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

    const savedFound = await knex("guardados").where({
      user_id: user.id,
      month,
    });

    if (savedFound.length !== 0) {
      return res
        .status(400)
        .json({ mensagem: "Já existe dinheiro guardado nesse mês" });
    }

    const saveRegistered = await knex("guardados").insert({
      value,
      month,
      user_id: user.id,
    });

    if (saveRegistered.length === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível guardar o dinheiro" });
    }

    return res.status(200).json("Dinheiro guardado com sucesso");
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listSaved = async (req, res) => {
  const { user } = req;

  try {
    const userFound = await knex("users").where({ id: user.id });
    if (userFound.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const saved = await knex("guardados").where({ user_id: user.id });
    return res.status(200).json(saved);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const attSaved = async (req, res) => {
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

    const saveFound = await knex("guardados").where({ id, user_id: user.id });
    if (saveFound.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Dinheiro guardado não encontrado" });
    }

    const monthFound = await knex("guardados")
      .where({ month })
      .andWhere({user_id: user.id})
      .andWhere("id", "!=", id);
    if (monthFound.length !== 0) {
      return res
        .status(400)
        .json({ mensagem: "Já existe dinheiro guardado nesse mês" });
    }

    const attSave = await knex("guardados")
      .update({
        value,
        month,
        user_id: user.id,
      })
      .where({ id, user_id: user.id });

    if (attSave.length === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível editar o dinheiro guardado" });
    }

    return res
      .status(200)
      .json({ mensagem: "Dinheiro guardado atualizado com sucesso" });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const deleteSaved = async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  try {
    const userFound = await knex("users").where({ id: user.id });
    if (userFound.length === 0) {
      return res.status(404).json({ mensagem: "usuário não encontrado" });
    }

    const saveFound = await knex("guardados").where({ id, user_id: user.id });
    if (saveFound.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Dinheiro guardado não encontrado" });
    }

    const delSave = await knex("guardados")
      .del()
      .where({ id, user_id: user.id });

    if (delSave.length === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível excluir o dinheiro atual" });
    }

    return res
      .status(200)
      .json({ mensagem: "Dinheiro atual excluido com sucesso" });
  } catch (error) {}
};

module.exports = {
  registerSaved,
  attSaved,
  listSaved,
  deleteSaved,
};
