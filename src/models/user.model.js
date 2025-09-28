"use strict";

const { Model } = require("sequelize");
const { default: slugify } = require("slugify");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      email: { type: DataTypes.STRING(50), unique: true },

      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      name: {
        type: DataTypes.STRING(20),
      },

      username: { type: DataTypes.STRING(100), unique: true },

      avatar: {
        type: DataTypes.STRING(255),
      },

      birthday: DataTypes.DATE,

      phone: {
        type: DataTypes.STRING(50),
        unique: true,
      },

      status: DataTypes.STRING(50),

      lastLogin: DataTypes.DATE,

      verifiedAt: DataTypes.DATE,

      createdAt: DataTypes.DATE,

      updatedAt: DataTypes.DATE,

      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      paranoid: true, // Enable soft delete
    }
  );

  // Handle username
  User.addHook("beforeCreate", async (user, options) => {
    if (options?.skipHandleUsername) return;
    if (user.name) {
      const baseSlug = slugify(user.name, {
        lower: true,
        strict: true,
      });
      let slug = baseSlug;
      let counter = 1;
      // Tìm username chưa tồn tại
      while (await User.findOne({ where: { username: slug }, hooks: false })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      user.username = slug;
    }
  });
  return User;
};
