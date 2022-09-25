const { Router } = require("express");
const { check } = require("express-validator");

const { login, googleSignIn } = require("../controllers/auth");
const { validarJWT } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get("/validarToken", validarJWT, validarCampos);

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es requerida").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  "/google",
  [check("id_token", "id_token es necesario!").not().isEmpty(), validarCampos],
  googleSignIn
);

module.exports = router;
