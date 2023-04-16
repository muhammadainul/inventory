'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.renameColumn(
                'User',
                'fullname',
                'nama_depan'
            ),
            queryInterface.addColumn(
                'User', 
                'nama_belakang',
                { 
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'User',  
                'email',
                { 
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'User', 
                'tempat_lahir',
                { 
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'User', 
                'jenis_kelamin',
                { 
                    type: Sequelize.STRING,
                    allowNull: true
                }
            )
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.renameColumn(
                'User',
                'fullname',
                'nama_depan'
            ),
            queryInterface.addColumn(
                'User', 
                'nama_belakang',
                { 
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'User',  
                'email',
                { 
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'User', 
                'tempat_lahir',
                { 
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'User', 
                'jenis_kelamin',
                { 
                    type: Sequelize.STRING,
                    allowNull: true
                }
            )
        ]);
    }
};
