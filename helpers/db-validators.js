const Role = require("../models/role");
const Usuario = require("../models/usuario");

//? Validar si el rol esta en DB
const esRolevalido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });

  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado  en la DB!`);
  }
};

const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });

  if (existeEmail) {
    throw new Error(`El correo ${correo} esta registrado  en la DB!`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);

  if (!existeUsuario) {
    throw new Error(`El id: ${id} no esta registrado  en la DB!`);
  }
};

module.exports = {
  esRolevalido,
  emailExiste,
  existeUsuarioPorId,
};
