const path = require("path");
const fs = require("fs");

// Require the Cloudinary library
const cloudinary = require("cloudinary").v2;
/* Configuring the cloudinary API. */
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {
  try {
    const archivo = await subirArchivo(req.files, undefined, "imgs");

    res.json({
      //status: true,
      archivo: archivo,
      msg: "Archivo cargado correctamente",
    });
  } catch (error) {
    res.status(400).json({
      msg: error,
    });
  }
};

/**
 * It checks if the collection is either usuarios or productos, if it is, it will check if the model
 * has an image, if it does, it will delete the image, and then it will save the file to the database
 * @param req - The request object.
 * @param [res] - response
 * @returns The model.
 */
const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  /* Checking if the collection is either usuarios or productos. */
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  /* Checking if the model has an image. If it does, it will delete the image. */
  if (modelo.img) {
    //TODO: Hay que borrar la imagen del servidor
    /* Joining the path of the image. */
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    /* Checking if the image exists and if it does, it will delete it. */
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  /* Saving the file to the database. */
  const archivo = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = archivo;

  await modelo.save();

  return res.json({ modelo });
};

const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  /* Checking if the collection is either usuarios or productos. */
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          status: false,
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          status: false,
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  /* Checking if the model has an image. If it does, it will delete the image. */
  if (modelo.img) {
    //TODO: Hay que borrar la imagen del servidor
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");

    cloudinary.uploader.destroy(`${coleccion}/${public_id}`);
  }

  /* Uploading the image to cloudinary. */
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
    folder: coleccion,
  });

  modelo.img = secure_url;
  await modelo.save();

  return res.json({
    status: true,
    msg: "Archivo cargado correctamente",
    archivo: req.files.archivo,
  });
};

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  /* Checking if the collection is either usuarios or productos. */
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  /* Checking if the model has an image. If it does, it will delete the image. */
  if (modelo.img) {
    /* Joining the path of the image. */
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    /* Checking if the image exists and if it does, it will send the image. */
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  /* Sending a default image if the image doesn't exist. */
  const pathNoImage = path.join(__dirname, "../assets/img/no-image.jpg");

  return res.sendFile(pathNoImage);
};

const mostrarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  /* Checking if the collection is either usuarios or productos. */
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  /* Checking if the model has an image. If it does, it will delete the image. */
  if (modelo.img) {
    const pathImagen = modelo.img;
    return res.redirect(pathImagen);
  }

  /* Sending a default image if the image doesn't exist. */
  const pathNoImage = path.join(__dirname, "../assets/img/no-image.jpg");

  return res.sendFile(pathNoImage);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
  mostrarImagenCloudinary,
};
