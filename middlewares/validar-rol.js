const { response } = require("express");
const usuario = require("../models/usuario");

const esAdminRol = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      status: false,
      msg: "Se quiere verificar el rol sin validar el token primero",
    });
  }

  //?Tomamos la info del usuario y hacemso validaciones
  const { rol, nombre, ...resto } = req.usuario;

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      status: false,
      msg: `${nombre} no tiene el rol de: Administrador - no puede hacer esto`,
    });
  }

  next();
};

const tieneRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar el rol sin validar el token primero",
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(401).json({
        msg: `EL servidor requiere uno de estsos roles: ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  esAdminRol,
  tieneRole,
};
