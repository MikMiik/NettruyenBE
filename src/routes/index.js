const express = require("express");
const router = express.Router();

// const productsRouter = require("./products.route");
const authRouter = require("./auth.route");
const comicRouter = require("./comic.route");

// router.use("/products", productsRouter);
router.use("/auth", authRouter);
router.use("/comics", comicRouter);

module.exports = router;
