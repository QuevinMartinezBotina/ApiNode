/* Importing the files from the folder. */
const dbvalidators = require("./db-validators");
const generarJWT = require("./generar-jwt");
const googleVerify = require("./google-verify");
const subirArchivo = require("./subir-archivo");

/* Exporting all the functions from the files in the folder. */
module.exports = {
  ...dbvalidators,
  ...generarJWT,
  ...googleVerify,
  ...subirArchivo,
};
