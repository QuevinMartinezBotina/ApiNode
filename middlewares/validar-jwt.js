const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  //?Si no viene un token dentro de la petición
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  //?Verifica si existe o no el token
  try {
    //*verificar token
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //*Lerr el usuario al que corresponde el uid
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido - usuario no existe en DB",
      });
    }

    //*Verificar si el estaod de user es true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no valido - usuario con estado: false",
      });
    }

    req.usuario = usuario;

    console.log(`El token de usuario para al ruta es: ${token}`);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "token no valido!",
    });
  }
};

module.exports = {
  validarJWT,
};
