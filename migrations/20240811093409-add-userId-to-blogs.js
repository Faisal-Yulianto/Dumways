'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Blogs', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: true // Pastikan ini diatur dengan benar
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Blogs', 'userId');
  }
};



