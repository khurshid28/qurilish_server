
const { Router } = require("express");

const router = Router();

let itemController = require("../controllers/item");
let checkToken = require("../middlewares/check-token");
router.use(checkToken)
router.post("/create",itemController.create);
router.get("/all",itemController.all);
router.get("/:id",itemController.get);
router.get("/",itemController.getbyProductId);
router.delete("/:id",itemController.delete);
router.put("/:id",itemController.update);

module.exports = router;