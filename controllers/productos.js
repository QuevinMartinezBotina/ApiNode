const { response, request } = require("express");
const { findOne } = require("../models/producto");

const Producto = require("../models/producto");

//* Obtener todos los productos
const obtenerProductos = async (req = request, res = response) => {
  const { limite = 10, desde = 0 } = req.query;

  const query = { estado: true };

  const [total, productos, x] = await Promise.all([
    Producto.countDocuments(query),
    //todo: Consultamos todos los productos paginados y con al informacion relacionada
    Producto.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("categoria", "nombre")
      .populate("usuario", "nombre"),
  ]);

  return res.json({
    total,
    productos,
  });
};

//*Para OBTENER un producto por ID
const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const productoDB = await Producto.findById(id)
    .populate("categoria", "nombre")
    .populate("usuario", "nombre");

  if (!productoDB) {
    return res.status(400).json({
      msg: `No existe un producto con el id ${id}`,
    });
  }

  return res.json({
    productoDB,
  });
};

//* Para CREAR un nuevo producto - privado - se requiere un token valido
const crearProducto = async (req, res = response) => {
  const {
    nombre,
    estado,
    precio,
    descripcion,
    disponible,
    usuario,
    categoria,
  } = req.body;

  /* Creating an object with the same name as the variables. */
  const data = {
    nombre,
    estado,
    precio,
    descripcion,
    disponible,
    usuario,
    categoria,
  };

  const nuevoProducto = new Producto(data);

  //* Guardar en DB
  await nuevoProducto.save();

  return res.status(201).json(nuevoProducto);
};

//* Para ACTUALIZAR un producto - privado - se requiere un token valido
const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;

  const { ...data } = req.body;

  const productoActualizado = await Producto.findByIdAndUpdate(
    id,
    { data },
    { new: true }
  );

  return res.json({
    estado: true,
    msg: "Producto actualizado",
  });
};

//* Para ELIMINAR un producto - Admin - se requiere un token valido
const borrarProducto = async (req, res = response) => {
  const { id } = req.params;

  const productoDB = await Producto.findByIdAndUpdate(id, { estado: false });

  return res.json({
    msg: "Producto eliminado",
    productoDB,
  });
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};
