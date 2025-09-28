const {
  Comic,
  Author,
  Genre,
  Page,
  sequelize,
  User,
  Like,
} = require("@/models");
const getCurrentUser = require("@/utils/getCurrentUser");
const { Op } = require("sequelize");
class ComicService {
  // Getter for current user ID - more concise
  get userId() {
    return getCurrentUser();
  }

  async getHomeComics() {
    const featuredComics = await Comic.findAll({
      limit: 4,
      order: [["viewCount", "DESC"]],
      attributes: [
        "id",
        "name",
        "slug",
        "authorId",
        "thumbnail",
        "status",
        "viewCount",
        "ratingCount",
        "updatedAt",
      ],
      include: [
        {
          model: Author,
          as: "author",
          attributes: ["id", "name"],
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });

    const latestComics = await Comic.findAll({
      order: [["updatedAt", "DESC"]],
      limit: 4,
      attributes: [
        "id",
        "name",
        "authorId",
        "thumbnail",
        "status",
        "viewCount",
        "ratingCount",
        "updatedAt",
      ],
      include: [
        {
          model: Author,
          as: "author",
          attributes: ["id", "name"],
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });

    const topRatedComics = await Comic.findAll({
      order: [["ratingCount", "DESC"]],
      limit: 5,
      attributes: ["id", "name", "viewCount", "ratingCount"],
      include: [
        {
          model: Author,
          as: "author",
          attributes: ["id", "name"],
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });

    return {
      featuredComics,
      latestComics,
      topRatedComics,
    };
  }

  async getAllComics(page = 1, limit = 10, type) {
    const offset = (page - 1) * limit;
    let order = [["createdAt", "DESC"]];
    let where = {};
    if (type === "featured") {
      order = [["viewCount", "DESC"]];
      where = {
        viewCount: {
          [Op.gt]: 1000,
        },
      };
    } else if (type === "latest") {
      order = [["updatedAt", "DESC"]];
      where = {
        updatedAt: {
          [Op.gt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      };
    }
    const { rows: comics, count } = await Comic.findAndCountAll({
      limit,
      offset,
      order,
      where,
      distinct: true,
      attributes: [
        "id",
        "name",
        "slug",
        "authorId",
        "thumbnail",
        "status",
        "viewCount",
        "ratingCount",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Author,
          as: "author",
          attributes: ["id", "name"],
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });

    return {
      comics,
      count,
    };
  }

  async getComicBySlug(slug) {
    const comic = await Comic.findOne({
      where: { slug },
      attributes: [
        "id",
        "name",
        "slug",
        "content",
        "authorId",
        "thumbnail",
        "status",
        "viewCount",
        "ratingCount",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Author,
          as: "author",
          attributes: ["id", "name"],
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["name"],
          through: { attributes: [] },
        },
        {
          model: Page,
          as: "pages",
          attributes: ["chapter", "updatedAt"],
          order: [["chapter", "ASC"]],
        },
      ],
    });

    let relatedComics = [];
    if (comic && comic.genres && comic.genres.length > 0) {
      const genreNames = comic.genres.map((genre) => genre.name);
      relatedComics = await Comic.findAll({
        attributes: [
          "id",
          "name",
          "slug",
          "authorId",
          "thumbnail",
          "status",
          "viewCount",
          "ratingCount",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Genre,
            as: "genres",
            attributes: ["name"],
            where: {
              name: {
                [Op.in]: genreNames,
              },
            },
            through: { attributes: [] },
          },
          {
            model: Author,
            as: "author",
            attributes: ["id", "name"],
          },
        ],
        where: {
          id: {
            [Op.ne]: comic.id, // ne = not equal
          },
        },
        limit: 3,
        order: [["updatedAt", "DESC"]],
        distinct: true,
      });
    }

    return { comic, relatedComics };
  }

  async getComicPages({ slug, chapterId }) {
    const comic = await Comic.findOne({ where: { slug }, attributes: ["id"] });
    if (!comic) throw new Error("Comic not found");
    const chapters = await Page.findAll({
      where: { comicId: comic.id },
      attributes: ["chapter"],
    });
    const pages = await Page.findAll({
      where: { chapter: chapterId, comicId: comic.id },
      order: [["chapter", "ASC"]],
      attributes: ["chapter", "imageUrl"],
    });
    return { pages: pages[0], chapters };
  }

  async likeComic(comicId) {
    try {
      const userId = this.userId;
      await sequelize.transaction(async (t) => {
        const user = await User.findOne({
          where: { id: userId },
          attributes: ["id", "avatar", "name"],
          transaction: t,
        });

        const comic = await Comic.findOne({
          where: { id: comicId },
          attributes: ["userId"],
          transaction: t,
        });
        const existing = await Like.findOne({
          where: { userId, likableId: comicId, likableType: "Comic" },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (existing) {
          throw new Error("You have already liked this post");
        }

        const like = await Like.create(
          { userId, likableId: postId, likableType: "Post" },
          { transaction: t }
        );

        await Post.increment("likesCount", {
          by: 1,
          where: { id: postId },
          transaction: t,
        });
        if (userId !== post.userId) {
          const res = await notificationService.createNotification({
            data: {
              type: "like",
              notifiableType: like.likableType,
              notifiableId: postId,
              content: `${user.name} liked your post`,
            },
            userId: post.userId,
            transaction: t,
          });
          return res;
        }
      });

      return { message: "Post liked" };
    } catch (error) {
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        error.message === "You have already liked this post"
      ) {
        return { message: error.message };
      }
      throw error;
    }
  }

  async unlikePost(postId) {
    try {
      const userId = this.userId;

      await sequelize.transaction(async (t) => {
        const like = await Like.findOne({
          where: { userId, likableId: postId, likableType: "Post" },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!like) {
          throw new Error("You have not liked this post yet");
        }

        await like.destroy({ transaction: t });

        await Post.decrement("likesCount", {
          by: 1,
          where: { id: postId },
          transaction: t,
        });
      });

      return { message: "Post unliked" };
    } catch (error) {
      if (error.message === "You have not liked this post yet") {
        return { message: error.message };
      }
      throw error;
    }
  }
}

module.exports = new ComicService();
