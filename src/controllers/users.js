const securePassword = require("secure-password");
const knex = require("../database/connection");
const jwt = require("jsonwebtoken");
const pwd = securePassword();

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ mensagem: "Os campos name, email e password são obrigatórios" });
  }
  try {
    const userFound = await knex("users").where({ email });

    if (userFound.length > 0) {
      return res.status(400).json({ mensagem: "email já cadastrado" });
    }

    const hash = (await pwd.hash(Buffer.from(password))).toString("hex");

    const userRegistered = await knex("users").insert({
      name,
      email,
      password: hash,
    });

    if (userRegistered.length === 0) {
      return res
        .status(500)
        .json({ mensagem: "Não foi possível cadastrar o usuário" });
    }

    return res.status(200).json({ mensagem: "Usuário cadastrado com sucesso" });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ mensagem: "Os campos email e senha sao obrigatórios" });
    }

    const userFound = await knex("users").where({ email });

    if (userFound.length === 0) {
      return res.status(404).json({ mensagem: "Email ou senha incorretos" });
    }

    const user = userFound[0];
    const result = await pwd.verify(
      Buffer.from(password),
      Buffer.from(user.password, "hex")
    );

    switch (result) {
      case securePassword.INVALID_UNRECOGNIZED_HASH:
      case securePassword.INVALID:
        return res.status(400).json({ mensagem: "Email ou senha incorretos" });
      case securePassword.VALID:
        break;
      case securePassword.VALID_NEEDS_REHASH:
        try {
          const hash = (await pwd.hash(Buffer.from(password))).toString("hex");
          await knex("users").update({ password: hash }).where("email", email);
        } catch {}
        break;
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    return res.status(200).json({
      usuario: {
        id: user.id,
        nome: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const userDetail = async (req, res) => {
  const { user } = req;

  try {
    const userFound = await knex("users")
      .select("name", "email")
      .where({ id: user.id });
    if (userFound.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    return res.status(200).json(userFound[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  signin,
  signup,
  userDetail,
};
