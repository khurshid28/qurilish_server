const { Router } = require("express");
const router = Router();

const categoryRouter = require("./category");
const productRouter = require("./product");
const superRouter = require("./super");
const userRouter = require("./user");
const loginRouter = require("./login");
const itemRouter= require("./item");
const homeRouter= require("./home");
const roomRouter= require("./room");


router.use("/category",categoryRouter);
router.use("/product",productRouter);
router.use("/item",itemRouter);


router.use("/home",homeRouter);
router.use("/room",roomRouter);

router.use("/super",superRouter);
router.use("/user",userRouter);

router.use("/login",loginRouter);



module.exports = router;
