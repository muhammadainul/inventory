'use strict';
module.exports = (sequelize, DataTypes) => {
    const BarangMasuk = sequelize.define(
        'Barang_masuk',
        {
            barang_id: DataTypes.INTEGER,
            tanggal_input: DataTypes.DATE,
            jumlah: DataTypes.INTEGER
        },
        { freezeTableName: true }
    );

    BarangMasuk.associate = function (models) {
        BarangMasuk.belongsTo(models.Barang, {
            foreignKey: 'barang_id',
            as: 'barang'
        });
    }
    
    return BarangMasuk;
};
