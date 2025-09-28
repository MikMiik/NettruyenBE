"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comic extends Model {
    static associate(models) {
      Comic.belongsToMany(models.Genre, {
        through: models.ComicGenre,
        foreignKey: "comicId",
        otherKey: "genreId",
        as: "genres",
      });
      Comic.belongsTo(models.Author, {
        foreignKey: "authorId",
        as: "author",
      });
      Comic.hasMany(models.Page, {
        foreignKey: "comicId",
        as: "pages",
      });
      Comic.hasMany(models.Chapter, {
        foreignKey: "comicId",
        as: "chapters",
      });
    }
  }
  Comic.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      otherName: { type: DataTypes.TEXT, allowNull: true },
      authorId: { type: DataTypes.INTEGER, allowNull: true },
      content: { type: DataTypes.TEXT, allowNull: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      thumbnail: { type: DataTypes.STRING },
      originalUrl: { type: DataTypes.STRING, allowNull: false, unique: true },
      status: { type: DataTypes.STRING },
      followingCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      ratingCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Comic",
      tableName: "comics",
      timestamps: true,
      paranoid: true,
    }
  );
  return Comic;
};
