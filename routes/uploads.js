const { Router } = require("express");
const { check } = require("express-validator");
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary, mostrarImagenCloudinary } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");

const { validarCampos, validarArchivoSubir } = require("../middlewares");

const router = Router();

/* Calling the `cargarArchivo` function. */
router.post("/", validarArchivoSubir, cargarArchivo);

/* Updating the image. */
router.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "El id debe ser de un id valido de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  /* actualizarImagen */ actualizarImagenCloudinary
);

router.get("/:coleccion/:id", [
  check("id", "El id debe ser de un id valido de mongo").isMongoId(),
  check("coleccion").custom((c) =>
    coleccionesPermitidas(c, ["usuarios", "productos"])
  ),
  validarCampos
], /* mostrarImagen */mostrarImagenCloudinary);

module.exports = router;
