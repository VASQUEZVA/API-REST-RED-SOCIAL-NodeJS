const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");
const multer = require("multer");

// Configuracion de subir archivo

const storage =  multer.diskStorage({
    destination: (req, file, cb) => {
            cb(null, "./uploads/avatars/")
    },

    filename: (req, file, cb) =>{
        cb(null, " avatar-"+Date.now()+"-"+file.originalname)
    }
});

const  uploads = multer({storage});

//  rutas enpoint

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id",check.auth, UserController.profile);
router.get("/list/:page?", check.auth, UserController.ListProfiles);
router.put("/update", check.auth, UserController.update);
router.post("/upload", [check.auth,uploads.single("file0")],UserController.upload);


module.exports = router;
