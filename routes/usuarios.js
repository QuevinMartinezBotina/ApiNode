const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
} = require("../controllers/usuarios");

const {
  esRolevalido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators"); //? Es para validar los roles que tenemos en DB

const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido!").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRolevalido),

    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    //? Aqui validamos que todos lo campos vengan correctos y se 'guardan errores'
    check("nombre", "Nombre es requerido!").not().isEmpty(),
    check(
      "password",
      "Password es requerido, debe ser mayor a 6 caracteres!"
    ).isLength({ min: 6 }),
    check("correo", "Email no valido!").isEmail(),
    check("correo").custom(emailExiste),

    //check("rol", "Rol no existe!").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(esRolevalido),
    //?Mostramos errores si existen en algun punto
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    check("id", "No es un ID valido!").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
