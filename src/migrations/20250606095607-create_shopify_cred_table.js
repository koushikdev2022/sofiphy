'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("creds", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      shop1_api_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shop1_api_secret: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shop1_access_token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shop1_domain: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1, // Default value for status (1 for active)
        comment: "1 for active, 0 for inactive",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
