const debug = require('debug');
const log = debug('inventory:services:');

const { isEmpty, toInteger } = require('lodash');

const { Kategori } = require('../models');
const { Op } = require('sequelize');

async function Create (kategoriData) {
    const { kategori, deskripsi } = kategoriData;
    log('[Kategori] Create', kategoriData);
    try {
        const created = await Kategori.create({
            kategori,
            deskripsi
        });

        return {
            message: 'Kategori berhasil disimpan.',
            data: await Kategori.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (kategoriData) {
    const { 
        kategori_id, 
        kategori,
        deskripsi 
    } = kategoriData;
    log('[Kategori] Update', kategoriData);
    try {
        const checkKategori = await Kategori.findOne({ 
            where: { id: kategori_id },
            raw: true
        });
        if (!checkKategori) throw { error: 'Kategori tidak tersedia.' };

        await Kategori.update({
            kategori,
            deskripsi
            },
            { where: { id: kategori_id }
            }
        );

        return {
            message: 'Kategori berhasil disimpan.',
            data: await Kategori.findOne({
                where: { id: checkKategori.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Delete (kategoriData) {
    const { kategori_id } = kategoriData;
    log('[Kategori] Delete', kategoriData);
    try {
        const checkKategori = await Kategori.findOne({ 
            where: { id: kategori_id },
            raw: true
        })
        if (!checkKategori) throw { error: 'Kategori tidak tersedia.' };
        
        await Kategori.destroy({ where: { id: kategori_id }});
       
        return {
            message: 'Kategori berhasil dihapus.'
        };
    } catch (error) {
        return error;
    }
}

async function Get (kategori_id) {
    log('[Kategori] Get', kategori_id);
    try {
        const checkKategori = await Kategori.findOne({ 
            where: { id: kategori_id },
            raw: true
        });
        if (!checkKategori) throw { error: 'Kategori tidak tersedia.' };
        
        return checkKategori
    } catch (error) {
        return error;
    }
}

async function List () {
    log('[Kategori] List');
    try {
        const kategoriData = await Kategori.findAll({ raw: true });
        
        return kategoriData;
    } catch (error) {
        return error;
    }
}

async function GetDatatables (kategoriData) {
    const { 
        draw, 
        // order, 
        start, 
        length, 
        search, 
        urutan 
    } = kategoriData;
    log('[Kategori] GetDatatables', kategoriData);
    try {
        let where;
        !isEmpty(search.value)
            ? (where = {
                [Op.or]: {
                    kategori: { 
                        [Op.like]: `%${search.value}%`
                    },
                    deskripsi: {
                        [Op.like]: `%${search.value}%`
                    }
                }
            })
            : (where = {});
        
        let searchOrder;
        (urutan) ? searchOrder = [['createdAt', urutan]] : searchOrder = [['createdAt', 'desc']];

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            Kategori.count({}),
            Kategori.count({ where }),
            Kategori.findAll({
                where,
                order: searchOrder,
                offset: toInteger(start),
                limit: toInteger(length),
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

module.exports = {
    Create,
    Update,
    Delete,
    Get,
    List,
    GetDatatables
}