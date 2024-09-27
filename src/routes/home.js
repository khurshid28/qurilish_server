
const { Router } = require("express");

const router = Router();

let homeController = require("../controllers/home");
const checkToken = require("../middlewares/check-token");
const upload = require("../utils/upload");

router.post("/create",upload("public/home/").single("image"),homeController.create);
router.get("/all",checkToken,homeController.all);
router.get("/:id",homeController.get);
router.delete("/:id",homeController.delete);
router.put("/:id",upload("public/home/").single("image"),homeController.update);

module.exports = router;