'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            nama_depan: DataTypes.STRING,
            nama_belakang: DataTypes.STRING,
            tempat_lahir: DataTypes.DATEONLY,
            email: DataTypes.STRING,
            jenis_kelamin: DataTypes.STRING,
            enabled: DataTypes.INTEGER
        },
        { freezeTableName: true }
    );
    return User;
};
