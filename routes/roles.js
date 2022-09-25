const { Router } = require("express");
const { check } = require("express-validator");

const { login, googleSignIn } = require("../controllers/auth");
const { rolesGet } = require("../controllers/role");
const { validarJWT } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get("/",[validarJWT, validarCampos], rolesGet);


module.exports = router;
