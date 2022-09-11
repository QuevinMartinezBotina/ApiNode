const Categoria = require("../models/categoria");

const existeCategoriaPorId = async (id) => {
  /* Checking if the id exists in the database. */
  const existeCategoria = await Categoria.findById(id);

  if (!existeCategoria) {
    throw new Error(`El id: ${id} no esta registrado  en la DB!`);
  }
  
};

module.exports = {
  existeCategoriaPorId,
};
