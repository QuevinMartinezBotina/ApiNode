const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 2, desde = 0 } = req.query;
  const query = { estado: true };

  //? Aqui ejecutamso con promesas dos consultas para hacerlo mas rapido y simultaneo
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find().skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    status: true,
    total,
    usuarios,
  });
};

const usuarioGetById = async (req, res = response) => {
  const { id } = req.params;
  const usuario = await Usuario.findById(id);

  return res.json(
    {
      status: true,
      usuario,
    },
    200
  );
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //*Validar
  /* const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    return res.status(400).json({
      msg: "Email exist!",
    });
  } */

  //*Encriptar password
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //*Guardar
  await usuario.save();

  res.json({
    status: true,
    msg: "Usuario creado",
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, estado, ...resto } = req.body;

  if (estado) {
    const estadoUsario = await Usuario.findByIdAndUpdate(id, {
      estado: estado,
    });
    return res.json(
      {
        status: true,
        msg: `Usuario actualizado`,
        estado,
        estadoUsario,
        id,
        estado,
      },
      200
    );
  }

  //* Validar contra DB
  if (password) {
    //*Encriptar password
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    status: true,
    msg: "Usuario actualizado",
    usuario,
  });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API - usuariosPatch",
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id, estado } = req.params;

  //?Borrar fisicamente
  //const usuario = await Usuario.findByIdAndDelete(id);

  //?Deshabilitar usuario peor no borrarlo pro si hay registros vinculados
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: estado });
  const usuarioAutenticado = req.usuario;

  return res.json({
    status: true,
    msg: "Usuario actualizado",
    usuario,
    usuarioAutenticado,
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
  usuarioGetById,
};
