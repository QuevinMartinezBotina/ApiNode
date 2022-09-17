const path = require("path");
const { v4: uuidv4 } = require("uuid");

const subirArchivo = (
  files,
  extensionesValidas = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    /* This is getting the file extension of the file that is being uploaded. */
    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1].toLowerCase();

    /* This is checking to see if the file extension is valid. If it is not valid, it will return an
   error. */
    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extension ${extension} no esta permitida - ${extensionesValidas}`
      );
    }

    /* This is creating a unique name for the file that is being uploaded. */
    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    /* This is the code that is actually uploading the file to the server. */
    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreTemp);
    });
  });
};

module.exports = {
  subirArchivo,
};
