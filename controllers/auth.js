const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(id_token);

    //*Verificar si existe Email en DB
    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      //*Si no existe, crear usuario
      usuario = new Usuario({
        nombre,
        img,
        correo,
        password: ":)",
        google: true
      });

      //*Guardar usuario en DB
      await usuario.save();
    }

    //*Si el usuario en DB
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "El usuario no está habilitado, estado: false",
      });
    }

    //*Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      message: "Todo bien",
      id_token,
      nombre,
      correo
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
  googleSignIn,
};
