'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Barang_masuk', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            barang_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Barang',
                    key: 'id'
                }
            },
            tanggal_input: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            },
            jumlah: {
                type: Sequelize.INTEGER
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
        await queryInterface.dropTable('Barang_masuk');
    }
};
