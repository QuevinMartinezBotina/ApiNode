const Role = require("../models/role");
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const { json } = require("express");

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
    throw new Error(`El correo ${correo} esta registrado  en la DB`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);

  if (!existeUsuario) {
    throw new Error(`El id: ${id} no esta registrado  en la DB!`);
  }
};

const existeProductoPorNombre = async (nombre) => {
  const productos = await Producto.find();

  productos.forEach((element) => {
    if (element.nombre.toUpperCase() == nombre.toUpperCase()) {
      throw new Error(`El producto ${nombre} ya existe en la DB!`);
    }
  });
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);

  if (!incluida) {
    throw new Error(
      `La coleccion ${coleccion} no es permitida, ${colecciones}`
    );
  }

  return true;
};

module.exports = {
  esRolevalido,
  emailExiste,
  existeUsuarioPorId,
  existeProductoPorNombre,
  coleccionesPermitidas,
};
