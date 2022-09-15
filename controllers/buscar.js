const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Categoria, Producto, Role } = require("../models");

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];



/**
 * If the search term is a valid MongoDB ObjectId, then search for the document by its ObjectId,
 * otherwise search for the document by its name.
 * @param [termino] - "5f2d8f8f8f8f8f8f8f8f8f8f"
 * @param [res] - response
 * @returns An object with a property called results.
 */
const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // True

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);

    return res.json({ results: usuario ? [usuario] : [] });
  }

  const regex = new RegExp(termino, "i");

  const usuario = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  return res.json({ total: usuario.length, results: usuario });
};

const buscarCategorias = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // True

  if (esMongoID) {
    const categoria = await Categoria.findById(termino);

    return res.json({ results: categoria ? [categoria] : [] });
  }

  const regex = new RegExp(termino, "i");

  const categoria = await Categoria.find({ nombre: regex, estado: true });

  return res.json({ total: categoria.length, results: categoria });
};

const buscarProductos = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // True

  if (esMongoID) {
    const producto = await Producto.findById(termino)
      .populate("categoria", "nombre")
      .populate("usuario", "nombre");

    return res.json({ results: producto ? [producto] : [] });
  }

  const regex = new RegExp(termino, "i");

  const producto = await Producto.find({ nombre: regex, estado: true })
    .populate("categoria", "nombre")
    .populate("usuario", "nombre");

  return res.json({ total: producto.length, results: producto });
};


//* Controlador para hacer la busqueda
const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "categorias":
      buscarCategorias(termino, res);
      break;
    case "productos":
      buscarProductos(termino, res);
      break;
    case "roles":
      buscarRoles(termino, res);
      break;
    default:
      res.status(500).json({
        msg: "Se me olvidó hacer esta búsqueda",
      });
  }
};

module.exports = {
  buscar,
};
