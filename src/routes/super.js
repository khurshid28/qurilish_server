
const { Router } = require("express");

const router = Router();

let SuperController = require("../controllers/super");
const checkToken = require("../middlewares/check-token");

router.post("/create",SuperController.create);
router.get("/all",SuperController.all);
router.get("/profile",checkToken,SuperController.profile);
router.get("/:id",SuperController.get);
router.delete("/:id",SuperController.delete);
router.put("/:id",SuperController.update);
module.exports = router;