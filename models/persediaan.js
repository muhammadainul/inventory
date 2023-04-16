'use strict';
module.exports = (sequelize, DataTypes) => {
    const Persediaan = sequelize.define(
        'Persediaan',
        {
            barang_id: DataTypes.INTEGER,
            stok_awal: DataTypes.INTEGER,
            masuk: DataTypes.INTEGER,
            keluar: DataTypes.INTEGER,
            total_harga_beli: DataTypes.INTEGER,
            total_harga_jual: DataTypes.INTEGER,
            stok_tersedia: DataTypes.INTEGER
        },
        { freezeTableName: true }
    );

    Persediaan.associate = function (models) {
        Persediaan.belongsTo(models.Barang, {
            foreignKey: 'barang_id',
            as: 'barang'
        });
    }
    
    return Persediaan;
};
