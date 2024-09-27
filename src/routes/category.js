
const { Router } = require("express");

const router = Router();

let categoryController = require("../controllers/category");
const upload = require("../utils/upload");

router.post("/create",upload("public/category/").single("image"),categoryController.create);
router.get("/all",categoryController.all);
router.get("/:id",categoryController.get);
router.delete("/:id",categoryController.delete);
router.put("/:id",upload("public/category/").single("image"),categoryController.update);

module.exports = router;