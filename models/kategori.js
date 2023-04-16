'use strict';
module.exports = (sequelize, DataTypes) => {
    const Kategori = sequelize.define(
        'Kategori',
        {
            kategori: DataTypes.STRING,
            deskripsi: DataTypes.STRING
        },
        { freezeTableName: true }
    );
    return Kategori;
};
