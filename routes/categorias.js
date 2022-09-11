const { Router, response, request } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/categoria-existe");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRol } = require("../middlewares/validar-rol");

const router = Router();

//* Obtener todas las categorias
router.get("/", obtenerCategorias);

//*Para OBTENER una categoria por ID
router.get(
  "/:id",
  [validarJWT, check("id").custom(existeCategoriaPorId), validarCampos],
  obtenerCategoria
);

//* Para CREAR una nueva categoria - privado - se requiere un token valido
router.post(
  "/",
  [
    validarJWT,
    esAdminRol,
    check("nombre", "El nombre de la categoria es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//* Para ACTUALIZAR una categoria - privado - se requiere un token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id").custom(existeCategoriaPorId),
    check("nombre", "El nombre de la categoria es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

//* Para ELIMINAR una categoria - Admin - se requiere un token valido
router.delete(
  "/:id",
  [validarJWT, check("id").custom(existeCategoriaPorId), validarCampos],
  eliminarCategoria
);

module.exports = router;
