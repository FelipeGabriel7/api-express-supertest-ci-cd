const verifiyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json("Token inválido, não autorizado");
  }

  return next();
};

module.exports = {
  verifiyToken,
};
