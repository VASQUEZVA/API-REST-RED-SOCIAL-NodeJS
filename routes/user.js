const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");
const multer = require("multer");

// Configuracion de subir archivo



//  rutas enpoint

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id",check.auth, UserController.profile);
router.get("/list/:page?", check.auth, UserController.ListProfiles);
router.put("/update", check.auth, UserController.update);
router.post("/upload", check.auth,UserController.upload);


module.exports = router;
