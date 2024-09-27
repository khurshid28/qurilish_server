
const { Router } = require("express");

const router = Router();
const checkToken = require("../middlewares/check-token");
let UserController = require("../controllers/user");

router.post("/create",UserController.create);
router.get("/all",UserController.all);
router.get("/profile",checkToken,UserController.profile);
router.get("/:id",UserController.get);
router.delete("/:id",UserController.delete);
router.put("/:id",UserController.update);

module.exports = router;