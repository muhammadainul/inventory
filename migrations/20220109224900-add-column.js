'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.renameColumn(
                'Barang',
                'harga',
                'harga_beli'
            ),
            queryInterface.addColumn(
                'Barang', 
                'harga_jual',
                { 
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: 0
                }
            ),
            queryInterface.addColumn(
                'Persediaan',  
                'total_harga_beli',
                { 
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: 0
                }
            ),
            queryInterface.addColumn(
                'Persediaan', 
                'total_harga_jual',
                { 
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: 0
                }
            )
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.renameColumn(
                'Barang',
                'harga',
                'harga_beli'
            ),
            queryInterface.addColumn(
                'Barang', 
                'harga_jual',
                { 
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: 0
                }
            ),
            queryInterface.addColumn(
                'Persediaan',  
                'total_harga_beli',
                { 
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: 0
                }
            ),
            queryInterface.addColumn(
                'Persediaan', 
                'total_harga_jual',
                { 
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: 0
                }
            )
        ]);
    }
};
