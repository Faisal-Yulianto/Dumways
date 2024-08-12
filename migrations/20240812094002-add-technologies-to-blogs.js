'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Blogs', 'technologies', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Blogs', 'technologies');
  }
};
  