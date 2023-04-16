const debug = require('debug');
const log = debug('inventory:services:');

const { isEmpty, toInteger, isInteger } = require('lodash');
const moment = require('moment');
const fs = require('fs');

const { Barang, Kategori } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

async function Create (files, barangData) {
    const {
        kode_barang,
        nama_barang,
        keterangan,
        harga,
        harga_jual,
        kategori_id,
        // tanggal_input
    } = barangData;
    log('[Barang] Create', { files, barangData });
    try {
        if (!kode_barang || !nama_barang || !kategori_id || !harga) 
            throw { error: 'Form harus diisi.' };

        const checkKodeBarang = await Barang.findOne({
            where: { kode_barang },
            raw: true
        });
        if (checkKodeBarang) throw { error: 'Kode barang sudah tersedia.' };

        const checkNamaBarang = await Barang.findOne({
            where: { nama_barang },
            raw: true
        });
        if (checkNamaBarang) throw { error: 'Nama barang sudah tersedia.' };

        if (isEmpty(files)) throw { error: 'Gambar harus dilampirkan.' };

        const created = await Barang.create({
            kode_barang,
            nama_barang,
            keterangan,
            harga_beli: harga,
            harga_jual,
            kategori_id,
            // tanggal_input,
            filename: files.filename,
            destination: files.destination
        });

        return {
            message: 'Barang berhasil disimpan.',
            data: await Barang.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (files, barangData) {
    const { 
        id,
        kode_barang,
        nama_barang,
        keterangan,
        harga,
        harga_jual,
        kategori_id,
        // tanggal_input
    } = barangData;
    log('[Barang] Update', { files, barangData });
    try {
        const checkBarang = await Barang.findOne({
            where: { id },
            raw: true
        });
        if (!checkBarang) throw { error: 'Barang tidak tersedia.' };

        if (!kode_barang || !nama_barang || !kategori_id || !harga) 
            throw { error: 'Form tidak boleh kosong.' };

        const checkKodeBarang = await Barang.findOne({
            where: { id: { [Op.ne]: id }, kode_barang },
            raw: true
        });
        if (checkKodeBarang) throw { error: 'Kode barang sudah tersedia.' };

        const checkNamaBarang = await Barang.findOne({
            where: { id: { [Op.ne]: id }, nama_barang },
            raw: true
        });
        if (checkNamaBarang) throw { error: 'Nama barang sudah tersedia.' };

        if (!isEmpty(files)) {
            await Barang.update({
                kode_barang,
                nama_barang,
                keterangan,
                harga_beli: harga,
                harga_jual,
                kategori_id,
                // tanggal_input,
                filename: files.filename,
                destination: files.destination
                },
                { where: { id }
                }
            );

            fs.unlinkSync(`./public/assets/upload/images/${checkBarang.filename}`);
        } else {
            await Barang.update({
                kode_barang,
                nama_barang,
                keterangan,
                harga_beli: harga,
                harga_jual,
                kategori_id,
                // tanggal_input,
                },
                { where: { id }
                }
            );
        }

        return {
            message: 'Barang berhasil disimpan.',
            data: await Barang.findOne({
                where: { id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Delete (barangData) {
    const { id } = barangData;
    log('[Barang] Delete', barangData);
    try {
        const checkBarang = await Barang.findOne({ 
            where: { id },
            raw: true
        })
        if (!checkBarang) throw { error: 'Barang tidak tersedia.' };
        
        await Barang.destroy({ where: { id } });

        fs.unlinkSync(`./public/assets/upload/images/${checkBarang.filename}`);
       
        return {
            message: 'Barang berhasil dihapus.'
        };
    } catch (error) {
        return error;
    }
}

async function Get (barang_id) {
    log('[Barang] Get', barang_id);
    try {
        const checkBarang = await Barang.findOne({ 
            where: { id: barang_id },
            raw: true
        });
        if (!checkBarang) throw { error: 'Barang tidak tersedia.' };
        
        return checkBarang
    } catch (error) {
        return error;
    }
}

async function List () {
    log('[Barang] List');
    try {
        const barangData = await Barang.findAll({ raw: true });
        
        return barangData;
    } catch (error) {
        return error;
    }
}

async function GetDatatables (barangData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        search,
        start_date_barang, 
        end_date_barang,
        kategori_id, 
        urutan
    } = barangData;
    log('[Barang] GetDatatables', barangData);
    try {
        let whereBySearch;
        !isEmpty(search.value)
            ? (whereBySearch = {
                [Op.or]: {
                    kode_barang: { 
                        [Op.like]: `%${search.value}%`
                    },
                    nama_barang: {
                        [Op.like]: `%${search.value}%`
                    },
                    keterangan: {
                        [Op.like]: `%${search.value}%`
                    },
                    harga_beli: {
                        [Op.like]: `%${search.value}%`
                    },
                    harga_jual: {
                        [Op.like]: `%${search.value}%`
                    }
                }
            })
            : (whereBySearch = {});

        let whereByKategori;
        (kategori_id) ? (whereByKategori = { kategori_id }) : (whereByKategori = {});

        let whereByDate;
        (start_date_barang || end_date_barang) 
            ?
            (whereByDate = {
                [Op.and]: [
                    { createdAt: { [Op.gte]: moment(start_date_barang).format() } },
                    { createdAt: { [Op.lte]: moment(end_date_barang).format() } }
                ]
            })
            :
            (whereByDate = {});

        const where = {
            ...whereBySearch,
            ...whereByKategori,
            ...whereByDate
        };
        
        let searchOrder;
        (urutan) ? searchOrder = [['createdAt', urutan]] : searchOrder = [['createdAt', 'desc']];

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Barang.count({}),
            Barang.count({
                include: {
                    model: Kategori,
                    as: 'kategori',
                    attributes: ['id', 'kategori']
                },
                where 
            }),
            Barang.findAll({
                include: {
                    model: Kategori,
                    as: 'kategori',
                    attributes: ['id', 'kategori']
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
        start_date_barang, 
        end_date_barang,
    } = barangData;
    log('[Barang] GetHistoryData', barangData);
    try {
        const data = await Barang.findAll({
            attributes: [
                'kode_barang', 
                'nama_barang', 
                'keterangan', 
                'harga_beli', 
                'harga_jual',
                'createdAt'
            ],
            include: {
                model: Kategori,
                as: 'kategori',
                attributes: ['kategori']
            },
            where: {
                [Op.and]: [
                    { createdAt: { [Op.gte]: moment(start_date_barang).format() } },
                    { createdAt: { [Op.lte]: moment(end_date_barang).format() } }
                ]
            },
            order: [['createdAt', 'asc']],
            nest: true,
            raw: true 
        });

        const barang = data.map((o, index) => {
            o.tanggal_input = moment(o.createdAt).format();
            o.harga_beli = `Rp. ${new Intl.NumberFormat().format(o.harga_beli)}`
            o.harga_jual = `Rp. ${new Intl.NumberFormat().format(o.harga_jual)}`
            return o;
        });
        
        return barang;
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