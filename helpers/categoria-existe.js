const Categoria = require("../models/categoria");

const existeCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id);

  if (!existeCategoria) {
    throw new Error(`El id: ${id} no esta registrado  en la DB!`);
  }
  
};

module.exports = {
  existeCategoriaPorId,
};
