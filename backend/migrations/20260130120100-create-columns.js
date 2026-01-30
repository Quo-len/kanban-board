'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('columns', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      boardId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'boards',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('columns');
  },
};
