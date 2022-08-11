const mongoose = require("mongoose");

const dbConecction = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);

    console.log("Base de datos online");
  } catch (error) {
    console.log(error);
    throw new Error("Error in conecction DB");
  }
};

module.exports = {
  dbConecction,
};
