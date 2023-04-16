'use strict';
module.exports = (sequelize, DataTypes) => {
    const Barang = sequelize.define(
        'Barang',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            kode_barang: DataTypes.STRING,
            nama_barang: DataTypes.STRING,
            keterangan: DataTypes.STRING,
            harga_beli: DataTypes.INTEGER,
            harga_jual: DataTypes.INTEGER,
            kategori_id: DataTypes.INTEGER,
            tanggal_input: DataTypes.DATE,
            filename: DataTypes.STRING,
            destination: DataTypes.STRING
        },
        { freezeTableName: true }
    );

    Barang.associate = function (models) {
        Barang.belongsTo(models.Kategori, {
            foreignKey: 'kategori_id',
            as: 'kategori'
        });
    }

    return Barang;
};
