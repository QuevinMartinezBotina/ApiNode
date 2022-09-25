const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const Role = require("../models/role");

const rolesGet = async (req = request, res = response) => {
  const { limite = 2, desde = 0 } = req.query;
  const query = { estado: true };

  //? Aqui ejecutamso con promesas dos consultas para hacerlo mas rapido y simultaneo
  const [total, roles] = await Promise.all([
    Role.countDocuments(query),
    Role.find().skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    status: true,
    total,
    roles,
  });
};

module.exports = {
  rolesGet,
};
