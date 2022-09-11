const express = require("express");
const cors = require("cors");
const { dbConecction } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    
    /* Defining the routes of the application. */
    this.paths = {
      authPath: "/api/auth",
      categoriasPath: "/api/categorias",
      usuariosPath: "/api/usuarios",
    };

    // conecction DB
    this.conecctionDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async conecctionDB() {
    await dbConecction();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio Público
    this.app.use(express.static("public"));
  }

  /**
   * This function is used to define the routes of the application
   */
  routes() {
    this.app.use(this.paths.authPath, require("../routes/auth"));
    this.app.use(this.paths.categoriasPath, require("../routes/categorias"));
    this.app.use(this.paths.usuariosPath, require("../routes/usuarios"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
