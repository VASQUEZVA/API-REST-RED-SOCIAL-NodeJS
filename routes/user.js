const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

// definir rutas

router.post("/register", UserController.register);

//Exportar router

module.exports = router;
