const debug = require('debug');
const log = debug('inventory:services:');

const { isEmpty, toInteger, forEach } = require('lodash');
const moment = require('moment');

const { 
    Barang, 
    Barang_masuk,
    Barang_keluar,
    Kategori,
    Persediaan, 
    sequelize
} = require('../models');
const { Op } = require('sequelize');

async function GetDatatables (laporanData) {
    const { 
        draw, 
        // order, 
        urutan,
        start, 
        length, 
        search,
        start_date,
        end_date,
        kategori_id
    } = laporanData;
    log('[Laporan] GetDatatables', laporanData);
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
                    },
                    '$barang.kategori.kategori$': {
                        [Op.like]: `%${search.value}%`
                    },
                    masuk: {
                        [Op.like]: `%${search.value}%`
                    },
                    keluar: {
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
                    { updatedAt: { [Op.gte]: moment(start_date).format() } },
                    { updatedAt: { [Op.lte]: moment(end_date).format() } }
                ]
            })
            :
            (whereByDate = {});

        let whereByKategori;
        (kategori_id) 
            ?
            (whereByKategori = {
                '$barang.kategori.id$': {
                    [Op.like]: `%${kategori_id}%`
                }
            })
            :
            (whereByKategori = {});

        const where = {
            ...whereBySearch,
            ...whereByDate,
            ...whereByKategori
        };
        
        let searchOrder;
        (urutan) ? searchOrder = [['updatedAt', urutan]] : searchOrder = [['updatedAt', 'desc']];

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Persediaan.count({}),
            Persediaan.count({
                include: {
                    model: Barang,
                    as: 'barang',
                    attributes: [
                        'id', 
                        'kode_barang', 
                        'nama_barang',
                        'harga_beli',
                        'harga_jual'
                    ],
                    include: {
                        model: Kategori,
                        as: 'kategori',
                        attributes: ['id', 'kategori']
                    }
                },
                where 
            }),
            Persediaan.findAll({
                include: {
                    model: Barang,
                    as: 'barang',
                    attributes: [
                        'id', 
                        'kode_barang', 
                        'nama_barang',
                        'harga_beli',
                        'harga_jual'
                    ],
                    include: {
                        model: Kategori,
                        as: 'kategori',
                        attributes: ['id', 'kategori']
                    }
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

// Dashboard
async function GetGraph (laporanData) {
    log('[Laporan] GetGraph', laporanData);
    try {
        const [
            barangMasuk,
            barangKeluar,
            totalBarangMasuk,
            totalBarangKeluar,
            totalStokTersedia
        ] = await Promise.all([
            Barang_masuk.findAll({
                attributes: [
                    [sequelize.fn('SUM', sequelize.col(`jumlah`)), 'total']
                ],
                include: {
                    model: Barang,
                    attributes: ['nama_barang'],
                    as: 'barang',
                
                },
                group: ['barang.nama_barang'],
                nest: true,
                raw: true
            }),
            Barang_keluar.findAll({
                attributes: [
                    [sequelize.fn('SUM', sequelize.col(`jumlah`)), 'total']
                ],
                include: {
                    model: Barang,
                    attributes: ['nama_barang'],
                    as: 'barang',
                
                },
                group: ['barang.nama_barang'],
                nest: true,
                raw: true
            }),
            Barang_masuk.sum('jumlah'),
            Barang_keluar.sum('jumlah'),
            Persediaan.sum('stok_tersedia')
        ])
       
        // barang masuk
        let labelsBarangMasuk = [];
        let countsBarangMasuk = [];

        forEach(barangMasuk, (dataBarangMasuk) => {
            let total = toInteger(dataBarangMasuk.total);
            labelsBarangMasuk.push(dataBarangMasuk.barang.nama_barang);
            countsBarangMasuk.push(total)
        });

        // barang keluar
        let labelsBarangKeluar = [];
        let countsBarangKeluar = [];

        forEach(barangKeluar, (dataBarangKeluar) => {
            let total = toInteger(dataBarangKeluar.total);
            labelsBarangKeluar.push(dataBarangKeluar.barang.nama_barang);
            countsBarangKeluar.push(total)
        });

        return {
            labelsBarangMasuk,
            countsBarangMasuk,
            labelsBarangKeluar,
            countsBarangKeluar,
            totalBarangMasuk,
            totalBarangKeluar,
            totalStokTersedia
        };
    } catch (error) {
        return error;
    }
}

async function GetHistoryData (riwayatData) {
    const { 
        start_date, 
        end_date,
    } = riwayatData;
    log('[Laporan] GetHistoryData', riwayatData);
    try {
        const data = await Persediaan.findAll({
            include: {
                model: Barang,
                as: 'barang',
                attributes: [
                    'id', 
                    'kode_barang', 
                    'nama_barang', 
                    'harga_beli', 
                    'harga_jual'
                ],
                include: {
                    model: Kategori,
                    as: 'kategori',
                    attributes: ['id', 'kategori']
                }
            },
            where: {
                [Op.and]: [
                    { updatedAt: { [Op.gte]: moment(start_date).format() } },
                    { updatedAt: { [Op.lte]: moment(end_date).format() } }
                ]
            },
            order: [['updatedAt', 'asc']],
            nest: true,
            raw: true 
        });

        const laporan = data.map((o, index) => {
            o.tanggal_update = moment(o.updatedAt).format();
            o.harga_beli = `Rp. ${new Intl.NumberFormat().format(o.barang.harga_beli)}`
            o.harga_jual = `Rp. ${new Intl.NumberFormat().format(o.barang.harga_jual)}`
            o.total_harga_beli = `Rp. ${new Intl.NumberFormat().format(o.total_harga_beli)}`
            o.total_harga_jual = `Rp. ${new Intl.NumberFormat().format(o.total_harga_jual)}`
            return o;
        });

        return laporan;
    } catch (error) {
        return error;
    }
}

module.exports = {
    GetDatatables,
    GetGraph,
    GetHistoryData
}