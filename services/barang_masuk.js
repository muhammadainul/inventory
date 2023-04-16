const debug = require('debug');
const log = debug('inventory:services:');

const { isEmpty, toInteger } = require('lodash');
const moment = require('moment');

const { 
    Barang, 
    Barang_masuk, 
    Kategori,
    Persediaan, 
    sequelize
} = require('../models');
const { Op } = require('sequelize');

async function Create (barangMasuk) {
    const {
        barang_id,
        tanggal_input,
        jumlah
    } = barangMasuk;
    log('[Barang Masuk] Create', barangMasuk);
    try {
        if (!barang_id || !jumlah || !tanggal_input) 
            throw { error: 'Form harus diisi.' };

        const checkKodeBarang = await Barang.findOne({
            where: { id: barang_id },
            raw: true
        });
        if (!checkKodeBarang) throw { error: 'Barang tidak tersedia.' };

        const checkPersediaan = await Persediaan.findOne({
            where: { barang_id },
            raw: true
        });  
        if (!checkPersediaan) {
            await Persediaan.create({
                barang_id,
                stok_awal: jumlah,
                masuk: jumlah,
                total_harga_beli: checkKodeBarang.harga_beli * jumlah,
                stok_tersedia: jumlah
            }); 
        } else {
            const totalBarangMasuk = toInteger(checkPersediaan.masuk) + toInteger(jumlah);
            const stokTersedia = toInteger(totalBarangMasuk) - toInteger(checkPersediaan.keluar);
            await Persediaan.update({
                masuk: totalBarangMasuk,
                total_harga_beli: checkPersediaan.total_harga_beli + (checkKodeBarang.harga_beli * jumlah),
                stok_tersedia: stokTersedia
                },
                { where: { barang_id } }
            );
        }

        const created = await Barang_masuk.create({
            barang_id,
            tanggal_input,
            jumlah
        });

        // socket.emit('addBarangMasuk', created);

        return {
            message: 'Barang masuk berhasil ditambah.',
            data: await Barang_masuk.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (barangMasuk) {
    const { 
        id,
        tanggal_input
    } = barangMasuk;
    log('[Barang Masuk] Update', barangMasuk);
    try {
        const checkBarang = await Barang_masuk.findOne({
            where: { id },
            raw: true
        });
        if (!checkBarang) throw { error: 'Barang masuk tidak tersedia.' };

        if (!tanggal_input) 
            throw { error: 'Form tidak boleh kosong.' };

        await Barang_masuk.update({
            tanggal_input,
            },
            { where: { id }
            }
        );

        return {
            message: 'Barang masuk berhasil diubah.',
            data: await Barang_masuk.findOne({
                where: { id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Delete (barangMasuk) {
    const { id, jumlah, barang_id } = barangMasuk;
    log('[Barang Masuk] Delete', barangMasuk);
    try {
        const checkBarang = await Barang_masuk.findOne({ 
            where: { id },
            raw: true
        })
        if (!checkBarang) throw { error: 'Barang masuk tidak tersedia.' };

        const checkPersediaan = await Persediaan.findOne({
            where: { barang_id },
            raw: true
        });
        
        const totalBarangMasuk = toInteger(checkPersediaan.masuk) - toInteger(jumlah);
        await Persediaan.update({
            masuk: totalBarangMasuk,
            total_harga_beli: checkPersediaan.total_harga_beli - (checkBarang.harga_beli * jumlah),
            stok_tersedia: totalBarangMasuk - checkPersediaan.keluar
        },
        { where: { barang_id } }
        );
        
        await Barang_masuk.destroy({ where: { id } });
       
        return {
            message: 'Barang masuk berhasil dihapus.'
        };
    } catch (error) {
        return error;
    }
}

async function Get (id) {
    log('[Barang Masuk] Get', id);
    try {
        const checkBarang = await Barang_masuk.findOne({ 
            where: { id },
            raw: true
        });
        if (!checkBarang) throw { error: 'Barang masuk tidak tersedia.' };
        
        return checkBarang
    } catch (error) {
        return error;
    }
}

async function List () {
    log('[Barang Masuk] List');
    try {
        const barangData = await Barang_masuk.findAll({ raw: true });
        
        return barangData;
    } catch (error) {
        return error;
    }
}

async function GetDatatables (barangMasuk) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        search,
        start_date,
        end_date,
        urutan
    } = barangMasuk;
    log('[Barang] GetDatatables', barangMasuk);
    try {
        let whereBySearch
        !isEmpty(search.value)
            ? (whereBySearch = {
                [Op.or]: {
                    '$barang.kode_barang$': { 
                        [Op.like]: `%${search.value}%`
                    },
                    '$barang.nama_barang$': {
                        [Op.like]: `%${search.value}%`
                    }
                }
            })
            : (whereBySearch = {});

        let whereByDate;
        (start_date || end_date) 
            ?
            (whereByDate = {
                [Op.and]: [
                    { tanggal_input: { [Op.gte]: moment(start_date).format() } },
                    { tanggal_input: { [Op.lte]: moment(end_date).format() } }
                ]
            })
            :
            (whereByDate = {});

        const where = {
            ...whereBySearch,
            ...whereByDate
        };
        
        let searchOrder;
        (urutan) ? searchOrder = [['createdAt', urutan]] : searchOrder = [['createdAt', 'desc']];

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Barang_masuk.count({}),
            Barang_masuk.count({
                include: {
                    model: Barang,
                    as: 'barang',
                    attributes: ['id', 'kode_barang', 'nama_barang']
                },
                where 
            }),
            Barang_masuk.findAll({
                attributes: [
                    'id',
                    'barang_id',
                    'tanggal_input',
                    'jumlah',
                    [sequelize.literal(`jumlah * barang.harga_beli`), 'total_harga'],
                    'createdAt',
                    'updatedAt'
                ],
                include: {
                    model: Barang,
                    as: 'barang',
                    attributes: ['id', 'kode_barang', 'nama_barang', 'harga_beli']
                },
                where,
                order: searchOrder,
                offset: toInteger(start),
                limit: toInteger(length),
                nest: true,
                raw: true 
            })
        ]);

        return {
            draw,
            recordsTotal,
            recordsFiltered,
            data
        };
    } catch (error) {
        return error;
    }
}

async function GetHistoryData (barangData) {
    const { 
        start_date, 
        end_date,
    } = barangData;
    log('[Barang Masuk] GetHistoryData', barangData);
    try {
        const data = await Barang_masuk.findAll({
            attributes: [
                'id',
                'barang_id',
                'tanggal_input',
                'jumlah',
                [sequelize.literal(`jumlah * barang.harga_beli`), 'total_harga'],
                'createdAt',
                'updatedAt'
            ],
            include: {
                model: Barang,
                as: 'barang',
                attributes: ['kode_barang', 'nama_barang', 'harga_beli'],
                include: {
                    model: Kategori,
                    as: 'kategori',
                    attributes: ['kategori']
                }
            },
            where: {
                [Op.and]: [
                    { tanggal_input: { [Op.gte]: moment(start_date).format() } },
                    { tanggal_input: { [Op.lte]: moment(end_date).format() } }
                ]
            },
            order: [['tanggal_input', 'asc']],
            nest: true,
            raw: true 
        });

        const laporan = data.map((o, index) => {
            o.tanggal_update = moment(o.tanggal_input).format();
            o.total_harga = `Rp. ${new Intl.NumberFormat().format(o.total_harga)}`
            return o;
        });

        return laporan;
    } catch (error) {
        return error;
    }
}

module.exports = {
    Create,
    Update,
    Delete,
    Get,
    List,
    GetDatatables,
    GetHistoryData
}