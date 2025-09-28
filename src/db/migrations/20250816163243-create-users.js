"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: Sequelize.STRING(20),

      email: { type: Sequelize.STRING(50), unique: true },

      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      avatar: {
        type: Sequelize.STRING(255),
      },

      username: {
        type: Sequelize.STRING(100),
        unique: true,
      },

      birthday: Sequelize.DATE,

      phone: {
        type: Sequelize.STRING(50),
        unique: true,
      },

      status: Sequelize.STRING(50),

      lastLogin: Sequelize.DATE,

      verifiedAt: Sequelize.DATE,

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
