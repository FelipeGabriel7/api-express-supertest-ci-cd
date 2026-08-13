const UserModel = require("../models/userModel");

async function createUser(req, res) {
  const { name, age } = req.body;

  try {
    const user = await UserModel.create(name, age);
    return res.status(201).json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json("Erro 500 do servidor");
  }
}

async function listAllUsers(req, res) {
  try {
    const users = await UserModel.findAll();
    return res.status(200).json(users);
  } catch (e) {
    console.error(e);
    return res.status(500).json("Erro 500 do servidor");
  }
}

async function listUniqueUser(req, res) {
  const id = parseInt(req.params.id);

  try {
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json("Usuário não existe");

    return res.status(200).json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json("Erro 500 no servidor");
  }
}

async function deleteUser(req, res) {
  const idUser = parseInt(req.params.id);

  try {
    const userDelete = await UserModel.delete(idUser);

    if (!userDelete) return res.status(404).json("Usuário não encontrado");

    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).json("Erro 500 do servidor");
  }
}

async function editUniqueUser(req, res) {
  const idUser = parseInt(req.params.id);
  const { name, age } = req.body;

  try {
    const updateduser = await UserModel.update(idUser, name, age);

    if (!updateduser) return res.status(404).json("Usuario não encontrado");

    return res.status(200).json(updateduser);
  } catch (e) {
    console.error(e);
    return res.status(500).json("Erro 500 do servidor");
  }
}

module.exports = {
  createUser,
  listAllUsers,
  listUniqueUser,
  deleteUser,
  editUniqueUser,
};
