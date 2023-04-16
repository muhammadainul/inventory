'use strict';
module.exports = (sequelize, DataTypes) => {
    const BarangKeluar = sequelize.define(
        'Barang_keluar',
        {
            barang_id: DataTypes.INTEGER,
            tanggal_input: DataTypes.DATE,
            jumlah: DataTypes.INTEGER
        },
        { freezeTableName: true }
    );
    
    BarangKeluar.associate = function (models) {
        BarangKeluar.belongsTo(models.Barang, {
            foreignKey: 'barang_id',
            as: 'barang'
        });
    }

    return BarangKeluar;
};
