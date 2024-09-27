
const { Router } = require("express");

const router = Router();

let loginController = require("../controllers/login");

router.post("/",loginController.login);


module.exports = router;