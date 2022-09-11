const { response, request } = require("express");
const Categoria = require("../models/categoria");

//* Obtener todas las categorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 2, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria
      .find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre"), //* Populating the user id with the user name
  ]);

  return res.json({
    ok: true,
    total,
    categorias,
  });
};

//* Obtener una categoria por ID
const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  return res.json({
    ok: true,
    categoria,
  });
};

//* Actualizar una categoria por ID
const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { nombre, ...resto } = req.body;

  let nombreUpper = nombre.toUpperCase();

  //* Validar que no exista una categoria con el mismo nombre
  const categoriaDB_nombre = await Categoria.findOne({ nombre: nombreUpper });

  if (categoriaDB_nombre) {
    return res.status(400).json({
      ok: false,
      msg: `La categoria ${categoriaDB_nombre.nombre} ya existe`,
    });
  }

  //* Updating the category name. */
  const actualizarCategoria = await Categoria.findByIdAndUpdate(id, {
    nombre: nombreUpper,
  });

  return res.json({
    ok: true,
    msg: "Categoria actualizada correctamente",
    id: actualizarCategoria.id,
    amtiguoNombre: actualizarCategoria.nombre,
    nuevoNombre: nombreUpper,
  });
};

//* Eliminar una categoria por ID
const eliminarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  //* Desahabilitar la categoria
  const categoriaDB = await Categoria.findByIdAndUpdate(id, { estado: false });

  return res.json({
    ok: true,
    msg: "Categoria deshabilitada correctamente",
    categoriaDB,
  });
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await categoria.findOne({ nombre });

  /* Checking if the category already exists. */
  if (categoriaDB) {
    return res.status(400).json({
      ok: false,
      msg: `La categoria ${categoriaDB.nombre} ya existe`,
    });
  }

  /* Creating an object with the name of the category and the user id. */
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoriaNueva = new categoria(data);

  await categoriaNueva.save();

  return res.json({
    ok: true,
    msg: "Categoria creada correctamente",
    categoriaNueva,
  });
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
