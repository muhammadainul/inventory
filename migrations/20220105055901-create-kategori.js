'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Kategori', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		kategori: {
			type: Sequelize.STRING
		},
      	deskripsi: {
			type: Sequelize.STRING
		},
      	createdAt: {
			allowNull: false,
			type: Sequelize.DATE
      	},
      	updatedAt: {
			allowNull: false,
			type: Sequelize.DATE
      	}
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Kategori');
  }
};