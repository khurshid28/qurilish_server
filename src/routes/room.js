
const { Router } = require("express");

const router = Router();

let roomController = require("../controllers/room");
const checkToken = require("../middlewares/check-token");
const upload = require("../utils/upload");

router.post("/create",checkToken,upload("public/room/").single("image"),roomController.create);
router.get("/all",roomController.all);
router.get("/:id",roomController.get);
router.get("/",roomController.getbyHomeId);
router.delete("/:id",roomController.delete);
router.put("/:id",upload("public/room/").single("image"),roomController.update);

module.exports = router;