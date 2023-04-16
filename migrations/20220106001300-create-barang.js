'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Barang', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            kode_barang: {
                allowNull: false,
                type: Sequelize.STRING
            },
            nama_barang: {
                type: Sequelize.STRING
            },
            keterangan: {
                type: Sequelize.STRING
            },
            harga: {
                type: Sequelize.INTEGER, 
                allowNull: true
            },
            kategori_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Kategori',
                    key: 'id'
                }
            },
            tanggal_input: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            },
            filename: {
                type: Sequelize.STRING
            },
            destination: {
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
        await queryInterface.dropTable('Barang');
    }
};
