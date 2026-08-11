function getHealth(req, res) {
  return res.status(200).json("OK! Status check");
}

module.exports = {
  getHealth,
};
