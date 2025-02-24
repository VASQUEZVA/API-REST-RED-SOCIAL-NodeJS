const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");

//  rutas enpoint

router.post("/register", UserController.register);
router.post("/login", UserController.login)
router.get("/profile/:id",check.auth, UserController.profile)
router.get("/list/:page?", check.auth, UserController.ListProfiles)
router.put("/update", check.auth, UserController.update);



module.exports = router;
