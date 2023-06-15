const knex = require("../database/connection");

const registerBilling = async (req, res) => {
  const { user } = req;
  const { value, data, description, type } = req.body;

  if (!value || !data || !description || !type) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios" });
  }

  try {
    const userFound = await knex("users").where({ id: user.id });

    if (userFound.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Usuário não encontrado, por favor cadastre-se" });
    }

    const billingRegistered = await knex("billings").insert({
      value,
      data,
      description,
      type,
      user_id: user.id,
    });

    if (billingRegistered.length === 0) {
      return res
        .status(500)
        .json({ mensagem: "Não foi possível cadastrar o registro" });
    }
    return res.status(200).json("Registro cadastrado com sucesso");
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listBillings = async (req, res) => {
  const { user } = req;

  try {
    const userFound = await knex("users").where({ id: user.id });

    if (userFound.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Usuário não encontrado, por favor cadastre-se" });
    }

    const billings = await knex("billings")
      .where({ user_id: user.id })
      .orderBy("id", "asc");

    return res.status(200).json(billings);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const attBilling = async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const { value, data, description, type } = req.body;

  if (!value || !data || !description || !type) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios" });
  }

  try {
    const foundUser = await knex("users").where({ id: user.id });

    if (foundUser.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const foundBilling = await knex("billings")
      .where({ id })
      .andWhere({ user_id: user.id });

    if (foundBilling.length === 0) {
      return res.status(404).json({ mensagem: "Registro não encontrado" });
    }

    const updatedBilling = await knex("billings")
      .update({
        value,
        data,
        description,
        type,
      })
      .where({ id })
      .andWhere({ user_id: user.id });

    if (updatedBilling.length === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível atualizar o registro" });
    }

    return res.status(200).json("Registro atualizado com sucesso");
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const delBilling = async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  try {
    const foundUser = await knex("users").where({ id: user.id });

    if (foundUser.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const foundBilling = await knex("billings")
      .where({ id })
      .andWhere({ user_id: user.id });

    if (foundBilling.length === 0) {
      return res.status(404).json({ mensagem: "Registro não encontrado" });
    }

    const deletedBilling = await knex("billings")
      .del()
      .where({ id })
      .andWhere({ user_id: user.id });

    if (deletedBilling.length === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível deletar o registro" });
    }

    return res.status(200).json("Registro excluído com sucesso");
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};
module.exports = {
  registerBilling,
  listBillings,
  attBilling,
  delBilling,
};
