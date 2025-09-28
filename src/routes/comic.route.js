const express = require("express");
const router = express.Router();
const comicController = require("@/controllers/api/comic.controller");

router.get("/", comicController.getHomeComics);
router.get("/all", comicController.getAllComics);
router.get("/:slug/chapter/:chapterId", comicController.getComicPages);
router.get("/:slug", comicController.getComicBySlug);

module.exports = router;
