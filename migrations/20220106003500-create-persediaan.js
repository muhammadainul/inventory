'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Persediaan', {
            id: {
                type: Sequelize.INTEGER, 
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            barang_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Barang',
                    key: 'id'
                }
            },
            stok_awal: {
                type: Sequelize.INTEGER,
                defaultValue: 0 
            },
            masuk: {
                type: Sequelize.INTEGER,
                defaultValue: 0 
            },
            keluar: {
                type: Sequelize.INTEGER,
                defaultValue: 0 
            },
            stok_tersedia: {
                type: Sequelize.INTEGER,
                defaultValue: 0 
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
        await queryInterface.dropTable('Persediaan');
    }
};
