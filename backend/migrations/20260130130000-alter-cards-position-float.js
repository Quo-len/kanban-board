'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('cards', 'position', {
      type: Sequelize.DOUBLE,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('cards', 'position', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
