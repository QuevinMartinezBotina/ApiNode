const validarCampos = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt"); //?Usado para validar el token de user y darle seguridad a las rutas
const validarRoles = require("./validar-rol");
const validarArchivoSubir = require("./validar-archivo");

//?Exporrtamos todos los midedlewares dentro de
module.exports = {
  ...validarCampos,
  ...validarJWT,
  ...validarRoles,
  ...validarArchivoSubir,
};
