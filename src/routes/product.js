
const { Router } = require("express");

const router = Router();

let productController = require("../controllers/product");
const upload = require("../utils/upload");

router.post("/create",upload("public/product/").single("image"),productController.create);
router.get("/all",productController.all);
router.get("/:id",productController.get);
router.get("/",productController.getbyCategoryId);
router.delete("/:id",productController.delete);
router.put("/:id",upload("public/product/").single("image"),productController.update);

module.exports = router;