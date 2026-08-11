let users = [];

function createUser(req, res) {
  const { name, age } = req.body;

  const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const newUser = {
    id,
    name,
    age,
  };
  users.push(newUser);
  return res.status(201).json(newUser);
}

function listAllUsers(req, res) {
  return res.status(200).json(users);
}

function listUniqueUser(req, res) {
  const idSearchUser = parseInt(req.params.id);

  const userFind = users.find((user) => user.id === idSearchUser);
  if (!userFind) {
    return res.status(404).json("Usuário não existe");
  }

  return res.status(200).json(userFind);
}

function deleteUser(req, res) {
  const idUser = parseInt(req.params.id);

  const findUser = users.findIndex((user) => user.id === idUser);
  if (findUser === -1) {
    return res
      .status(404)
      .json("Não foi possível excluir o usuário o mesmo não existe");
  }

  const removedUser = users.splice(findUser, 1);
  return removedUser
    ? res.status(200).json("Usuario removido com sucesso")
    : res.status(404).json("Ocorreu um erro ao remover o usuário");
}

function editUniqueUser(req, res) {
  const idUser = parseInt(req.params.id);
  const { name, age } = req.body;

  const findUser = users.findIndex((user) => user.id === idUser);

  if (findUser === -1) {
    return res.status(404).json("Usuário não encontrado");
  }

  let idUserupdated = users[findUser].id;

  const updateUser = {
    id: idUserupdated,
    name,
    age,
  };

  users[findUser] = updateUser;

  return res.status(200).json(updateUser);
}

module.exports = {
  createUser,
  listAllUsers,
  listUniqueUser,
  deleteUser,
  editUniqueUser,
};
