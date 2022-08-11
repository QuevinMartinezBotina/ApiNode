const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
  //?Si existe algun error lo muestra con un error 400
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  //?Si todo sale bien continua a otra parte del código
  next();
};

module.exports = {
  validarCampos,
};
