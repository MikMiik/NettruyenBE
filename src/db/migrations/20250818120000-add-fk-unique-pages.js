"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraint for comicId
    await queryInterface.addConstraint("pages", {
      fields: ["comicId"],
      type: "foreign key",
      name: "fk_pages_comicId",
      references: {
        table: "comics",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraint
    await queryInterface.removeConstraint("pages", "fk_pages_comicId");
  },
};
