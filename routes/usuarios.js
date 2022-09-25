const { Router } = require("express");
const { check } = require("express-validator");

//?Importaciones de middlewares optimizada
const {
  validarCampos,
  validarJWT,
  esAdminRol,
  tieneRole,
} = require("../middlewares");

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
  usuarioGetById,
} = require("../controllers/usuarios");

const {
  esRolevalido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators"); //? Es para validar los roles que tenemos en DB

const router = Router();

router.get("/", usuariosGet);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarJWT,
    validarCampos,
  ],
  usuarioGetById
);

router.put(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("correo", "Revisa el correo").optional().isEmail(),
    check("rol").optional().custom(esRolevalido),

    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    //? Aqui validamos que todos lo campos vengan correctos y se 'guardan errores'
    check("nombre", "Nombre es requerido").not().isEmpty(),
    check(
      "password",
      "Password es requerido, debe ser mayor a 6 caracteres"
    ).isLength({ min: 6 }),
    check("correo", "Email no valido!").isEmail(),
    check("correo").custom(emailExiste),

    //check("rol", "Rol no existe!").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").optional().custom(esRolevalido),
    //?Mostramos errores si existen en algun punto
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id/:estado",
  [
    validarJWT,
    esAdminRol,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE", "NOSE_ROLE"),
    check("id", "No es un ID valido!").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
