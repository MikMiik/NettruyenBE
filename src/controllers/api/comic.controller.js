const comicService = require("@/services/comic.service");

exports.getHomeComics = async (req, res) => {
  const comics = await comicService.getHomeComics();
  return res.success(200, comics);
};

exports.getAllComics = async (req, res) => {
  const { limit = 10, page = 1, type = "all" } = req.query;
  const pageNum = isNaN(+page) ? 1 : +page;
  const limitNum = isNaN(+limit) ? 10 : +limit;
  const data = await comicService.getAllComics(pageNum, limitNum, type);
  return res.success(200, data);
};

exports.getComicBySlug = async (req, res) => {
  const { slug } = req.params;
  const data = await comicService.getComicBySlug(slug);
  return res.success(200, data);
};

exports.getComicPages = async (req, res) => {
  const { slug, chapterId } = req.params;
  const data = await comicService.getComicPages({ slug, chapterId });
  return res.success(200, data);
};
