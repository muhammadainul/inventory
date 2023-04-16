const debug = require('debug');
const log = debug('inventory:services:');

const { isEmpty, toInteger } = require('lodash');
const moment = require('moment');

const { 
    Barang, 
    Barang_keluar, 
    Kategori,
    Persediaan 
} = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

async function Create (barangKeluar) {
    const {
        barang_id,
        tanggal_input,
        jumlah
    } = barangKeluar;
    log('[Barang Keluar] Create', barangKeluar);
    try {
        if (!barang_id || !jumlah || !tanggal_input) 
            throw { error: 'Form harus diisi.' };

        const checkKodeBarang = await Barang.findOne({
            where: { id: barang_id },
            raw: true
        });
        if (!checkKodeBarang) throw { error: 'Barang tidak tersedia.' };

        let created;
        const checkPersediaan = await Persediaan.findOne({
            where: { barang_id },
            raw: true
        });  
        if (!checkPersediaan) {
            throw { 
                error: 'Persediaan belum tersedia. Silahkan tambah barang masuk terlebih dahulu.' 
            };
        } else {
            const totalBarangKeluar = toInteger(checkPersediaan.keluar) + toInteger(jumlah);
            if (totalBarangKeluar > checkPersediaan.masuk && totalBarangKeluar >= checkPersediaan.stok_tersedia) {
                throw {
                    error: 'Jumlah barang keluar melebihi dari stok yang tersedia.'
                };
            }  

            if (checkPersediaan.stok_tersedia == 0) {
                throw {
                    error: 'Stok barang tidak tersedia.'
                };
            } 

            created = await Barang_keluar.create({
                barang_id,
                tanggal_input,
                jumlah
            });

            await Persediaan.update({
                keluar: totalBarangKeluar,
                total_harga_jual: checkPersediaan.total_harga_jual + (checkKodeBarang.harga_jual * jumlah),
                stok_tersedia: checkPersediaan.masuk - totalBarangKeluar
                },
                { where: { barang_id } }
            );
        }

        return {
            message: 'Barang keluar berhasil ditambah.',
            data: await Barang_keluar.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (barangKeluar) {
    const { 
        id,
        tanggal_input
    } = barangKeluar;
    log('[Barang Keluar] Update', barangKeluar);
    try {
        const checkBarang = await Barang_keluar.findOne({
            where: { id },
            raw: true
        });
        if (!checkBarang) throw { error: 'Barang keluar tidak tersedia.' };

        if (!tanggal_input) 
            throw { error: 'Form tidak boleh kosong.' };

        await Barang_keluar.update({
            tanggal_input,
            },
            { where: { id }
            }
        );

        return {
            message: 'Barang keluar berhasil diubah.',
            data: await Barang_keluar.findOne({
                where: { id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Delete (barangKeluar) {
    const { id, jumlah, barang_id } = barangKeluar;
    log('[Barang Keluar] Delete', barangKeluar);
    try {
        const checkBarang = await Barang_keluar.findOne({ 
            where: { id },
            raw: true
        })
        if (!checkBarang) throw { error: 'Barang keluar tidak tersedia.' };

        const checkPersediaan = await Persediaan.findOne({
            where: { barang_id },
            raw: true
        });

        const totalBarangKeluar = toInteger(checkPersediaan.keluar) - toInteger(jumlah);
        await Persediaan.update({
            keluar: totalBarangKeluar,
            total_harga_jual: checkPersediaan.total_harga_jual - (checkBarang.harga_jual * jumlah),
            stok_tersedia: checkPersediaan.masuk - totalBarangKeluar
        },
        { where: { barang_id } }
        );
        
        await Barang_keluar.destroy({ where: { id } });
       
        return {
            message: 'Barang keluar berhasil dihapus.'
        };
    } catch (error) {
        return error;
    }
}

async function Get (id) {
    log('[Barang Keluar] Get', id);
    try {
        const checkBarang = await Barang_keluar.findOne({ 
            where: { id },
            raw: true
        });
        if (!checkBarang) throw { error: 'Barang keluar tidak tersedia.' };
        
        return checkBarang
    } catch (error) {
        return error;
    }
}

async function List () {
    log('[Barang Keluar] List');
    try {
        const barangData = await Barang_keluar.findAll({ raw: true });
        
        return barangData;
    } catch (error) {
        return error;
    }
}

async function GetDatatables (barangKeluar) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        search,
        start_date,
        end_date,
        urutan
    } = barangKeluar;
    log('[Barang] GetDatatables', barangKeluar);
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
            Barang_keluar.count({}),
            Barang_keluar.count({
                include: {
                    model: Barang,
                    as: 'barang',
                    attributes: ['id', 'kode_barang', 'nama_barang']
                },
                where 
            }),
            Barang_keluar.findAll({
                attributes: [
                    'id',
                    'barang_id',
                    'tanggal_input',
                    'jumlah',
                    [sequelize.literal(`jumlah * barang.harga_jual`), 'total_harga'],
                    'createdAt',
                    'updatedAt'
                ],
                include: {
                    model: Barang,
                    as: 'barang',
                    attributes: ['id', 'kode_barang', 'nama_barang', 'harga_jual']
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
    log('[Barang Keluar] GetHistoryData', barangData);
    try {
        const data = await Barang_keluar.findAll({
            attributes: [
                'id',
                'barang_id',
                'tanggal_input',
                'jumlah',
                [sequelize.literal(`jumlah * barang.harga_jual`), 'total_harga'],
                'createdAt',
                'updatedAt'
            ],
            include: {
                model: Barang,
                as: 'barang',
                attributes: ['kode_barang', 'nama_barang'],
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