const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: [true, "El estado es obligatorio"],
  },
  precio: {
    type: Number,
    default: 0,
    required: [true, "El precio es obligatorio"],
  },
  descripcion: {
    type: String,
    default: "",
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  usuario: {
    /* A reference to the user who created the category. */
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, "El usuario es obligatorio"],
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: [true, "La categoria es obligatoria"],
  },
});

ProductoSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();
  return data;
};

module.exports = model("Producto", ProductoSchema);
