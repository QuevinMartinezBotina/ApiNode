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
    status: true,
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
    status: true,
    msg: "Producto encontrado",
    producto: productoDB,
  });
};

//* Para CREAR un nuevo producto - privado - se requiere un token valido
const crearProducto = async (req, res = response) => {
  const { nombre, estado, precio, descripcion, disponible, categoria } =
    req.body;

  /* Creating an object with the same name as the variables. */
  const data = {
    nombre,
    estado,
    precio,
    descripcion,
    disponible,
    usuario: req.usuario._id,
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

  /* Assigning the user id to the data object. */
  data.usuario = req.usuario._id;

  /* Creating an object with the same name as the variables. */
  const productoActualizado = await Producto.findByIdAndUpdate(id, data);

  return res.json({
    status: true,
    msg: "Producto actualizado",
    data,
  });
};

//* Para ELIMINAR un producto - Admin - se requiere un token valido
const borrarProducto = async (req, res = response) => {
  const { id, estado } = req.params;

  const productoDB = await Producto.findByIdAndUpdate(id, { disponible: estado });

  return res.json({
    status: true,
    msg: "Estado del producto actualizado",
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
