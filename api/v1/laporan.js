const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('inventory:laporan:');

const { Parser } = require("json2csv");
const fs = require('fs');
const moment = require('moment');

const LaporanService = require('../../services/laporan');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
};

router.post('/datatables', isAuthenticated, async (req, res, next) => {
    const laporanData = req.body;

    const result = await LaporanService.GetDatatables(laporanData);
    log('result', result);

    if (result.error) {
        return res.json({ status: 400, error: result.error });
    } else { 
        return res.status(200).json(result).data;
    }
});

router.post('/graph', isAuthenticated, async (req, res, next) => {
    const laporanData = req.body;

    const result = await LaporanService.GetGraph(laporanData);
    log('result', result);

    if (result.error) {
        return res.json({ 
            status: 400, 
            error: result.error 
        });
    } else {
        return res.status(200).json({
            status: 200,
            data: result
        });
    }
});

router.post('/export', isAuthenticated, async (req, res, next) => {
    const laporanData = req.body;

    const options = {
        defaultValue : "none",
        fields : [
            {
                label: 'Kode Barang',
                value: 'barang.kode_barang'
            },
            {
                label: 'Nama Barang',
                value: 'barang.nama_barang'
            },
            {
                label: 'Kategori',
                value: 'barang.kategori.kategori'
            },
            {
                label: 'Barang Masuk',
                value: 'masuk'
            },
            {
                label: 'Barang Keluar',
                value: 'keluar'
            },
            {
                label: 'Harga Beli Satuan',
                value: 'harga_beli'
            },
            {
                label: 'Harga Jual Satuan',
                value: 'harga_jual'
            },
            {
                label: 'Total Harga Beli',
                value: 'total_harga_beli'
            },
            {
                label: 'Total Harga Jual',
                value: 'total_harga_jual'
            },
            {
                label: 'Stok Tersedia',
                value: 'stok_tersedia'
            },
            {
                label: 'Tanggal Update',
                value: 'tanggal_update'
            }
        ]
    }   

    const csvData = await LaporanService.GetHistoryData(laporanData);
    const json2csvParser = new Parser(options);
    const result = json2csvParser.parse(csvData);
    const target = `./public/assets/upload/files/Laporan-${moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')}.csv`;
    fs.writeFileSync(target, result);
    res.download(target);
});

module.exports = router;
