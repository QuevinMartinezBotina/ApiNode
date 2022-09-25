const express = require("express");
const cors = require("cors");
const { dbConecction } = require("../database/config");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    /* Defining the routes of the application. */
    this.paths = {
      authPath: "/api/auth",
      buscarPath: "/api/buscar",
      categoriasPath: "/api/categorias",
      productosPath: "/api/productos",
      usuariosPath: "/api/usuarios",
      uploadsPath: "/api/uploads",
      rolesPath: "/api/roles",
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

    // Carga de archivos
    // Note that this option available for versions 1.0.0 and newer.
    this.app.use(
      fileUpload({
        useTempFiles: true,
        createParentPath: true,
      })
    );
  }

  /**
   * This function is used to define the routes of the application
   */
  routes() {
    this.app.use(this.paths.authPath, require("../routes/auth"));
    this.app.use(this.paths.buscarPath, require("../routes/buscar"));
    this.app.use(this.paths.categoriasPath, require("../routes/categorias"));
    this.app.use(this.paths.productosPath, require("../routes/productos"));
    this.app.use(this.paths.usuariosPath, require("../routes/usuarios"));
    this.app.use(this.paths.uploadsPath, require("../routes/uploads"));
    this.app.use(this.paths.rolesPath, require("../routes/roles"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
