/* Importing the modules. */
const { Router, response, request } = require("express");
const { check } = require("express-validator");
const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  borrarProducto,
  actualizarProducto,
} = require("../controllers/productos");
const { existeCategoriaPorId } = require("../helpers/categoria-existe");
const {
  existeUsuarioPorId,
  existeCategoriaPorNombre,
  existeProductoPorNombre,
} = require("../helpers/db-validators");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRol } = require("../middlewares/validar-rol");

/* Creating a new router object. */
const router = Router();

//* Obtener todos los productos
router.get("/", obtenerProductos);

//*Para OBTENER un producto por ID
router.get(
  "/:id",
  [
    validarJWT,
    check("id", "Id es es requerido").not().isEmpty(),
    check("id", "Id no es valido").isMongoId(),
    validarCampos,
  ],
  obtenerProducto
);

//* Para CREAR un nuevo producto - privado - se requiere un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "Nombre es requerido").not().isEmpty(),
    check("precio", "Precio es requerido").not().isEmpty(),
    check("nombre").custom(existeProductoPorNombre),

    //*campos relacionados a otra tabla
    check("categoria", "Categoria es requerida").not().isEmpty(),
    check("categoria", "Categoria no es un ID valido").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    check("usuario", "Usuario es requerido").not().isEmpty(),
    check("usuario").custom(existeUsuarioPorId),
    validarCampos,
  ],
  crearProducto
);

//* Para ACTUALIZAR un producto - privado - se requiere un token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "Id es es requerido").not().isEmpty(),
    check("id", "Id no es valido").isMongoId(),
    check("nombre").custom(existeProductoPorNombre),

    //*campos relacionados a otra tabla
    check("categoria", "Categoria no es un ID valido").optional().isMongoId(),
    check("categoria").optional().custom(existeCategoriaPorId),
    check("usuario", "Usuario es requerido").optional().not().isEmpty(),
    check("usuario").optional().custom(existeUsuarioPorId),

    validarCampos,
  ],
  actualizarProducto
);

//* Para ELIMINAR un producto - Admin - se requiere un token valido
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "Id es es requerido").not().isEmpty(),
    check("id", "Id no es valido").isMongoId(),
    esAdminRol,
    validarCampos,
  ],
  borrarProducto
);

/* Exporting the router object. */
module.exports = router;
