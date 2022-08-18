const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    //*Verificar si existe Email
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "usuario/contraseña incorrectos!",
      });
    }

    //*Si el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "El usuario no está habilitado, estado: false",
      });
    }

    //*Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "La contraseña es incorrecta!",
      });
    }

    //*Generar JWT
    const token = await generarJWT(usuario.id);

    //*Respuesta d elogin correcto
    res.json({
      msg: `Login ok!`,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: `Error interno, hable con el administrador!`,
    });
  }
};

module.exports = {
  login,
};
