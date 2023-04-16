const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('inventory:transaksi:');

const { Parser } = require("json2csv");
const fs = require('fs');
const moment = require('moment');
const { split } = require('lodash');  

const BarangMasukService = require('../../services/barang_masuk');
const BarangKeluarService = require('../../services/barang_keluar');
const BarangService = require('../../services/barang');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
};

router.post('/barang_masuk/datatables', isAuthenticated, async (req, res, next) => {
    const barangMasuk = req.body;

    const result = await BarangMasukService.GetDatatables(barangMasuk);
    log('result', result);

    if (result.error) {
        return res.json({ status: 400, error: result.error });
    } else { 
        return res.status(200).json(result).data;
    }
});

router.post('/barang_masuk/add', isAuthenticated, async (req, res, next) => {
    const barangMasuk = req.body;

    const result = await BarangMasukService.Create(barangMasuk);
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

router.post('/barang_masuk/update', isAuthenticated, async (req, res, next) => {
    const barangMasuk = req.body;

    const result = await BarangMasukService.Update(barangMasuk);
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

router.post('/barang_masuk/delete', isAuthenticated, async (req, res, next) => {
    const barangMasuk = req.body;

    const result = await BarangMasukService.Delete(barangMasuk);
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

router.get('/barang_masuk/list', isAuthenticated, async (req, res, next) => {
    const result = await BarangMasukService.List();
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

router.get('/barang_masuk/edit/:id', isAuthenticated, async (req, res, next) => {
    const id = req.params.id;

    const result = await BarangMasukService.Get(id);
    log('result', result);

    const tanggal_input = moment(result.tanggal_input).format('YYYY-MM-DDTHH:MM');

    const barang = await BarangService.List();

    if (result.error)
        return res.status(400).send({ status: 400, error: result.error });
    else
        return res.render('pages/transaksi/barang_masuk/edit', {
            page: 'barang_masuk',
            user: req.user,
            result,
            barang,
            tanggal_input
        });
});

router.post('/barang_masuk/export', isAuthenticated, async (req, res, next) => {
    const barangData = req.body;

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
                label: 'Jumlah',
                value: 'jumlah'
            },
            {
                label: 'Total Harga',
                value: 'total_harga'
            },
            {
                label: 'Tanggal Input',
                value: 'tanggal_input'
            }
        ]
    }   

    const csvData = await BarangMasukService.GetHistoryData(barangData);
    const json2csvParser = new Parser(options);
    const result = json2csvParser.parse(csvData);
    const target = `./public/assets/upload/files/Barang-masuk-${moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')}.csv`;
    fs.writeFileSync(target, result);
    res.download(target);
});

// Barang keluar
router.post('/barang_keluar/datatables', isAuthenticated, async (req, res, next) => {
    const barangKeluar = req.body;

    const result = await BarangKeluarService.GetDatatables(barangKeluar);
    log('result', result);

    if (result.error) {
        return res.json({ status: 400, error: result.error });
    } else { 
        return res.status(200).json(result).data;
    }
});

router.post('/barang_keluar/add', isAuthenticated, async (req, res, next) => {
    const barangKeluar = req.body;

    const result = await BarangKeluarService.Create(barangKeluar);
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

router.post('/barang_keluar/update', isAuthenticated, async (req, res, next) => {
    const barangKeluar = req.body;

    const result = await BarangKeluarService.Update(barangKeluar);
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

router.post('/barang_keluar/delete', isAuthenticated, async (req, res, next) => {
    const barangKeluar = req.body;

    const result = await BarangKeluarService.Delete(barangKeluar);
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

router.get('/barang_keluar/list', isAuthenticated, async (req, res, next) => {
    const result = await BarangKeluarService.List();
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

router.get('/barang_keluar/edit/:id', isAuthenticated, async (req, res, next) => {
    const id = req.params.id;

    const result = await BarangKeluarService.Get(id);
    log('result', result);

    const tanggal_input = moment(result.tanggal_input).format('YYYY-MM-DDTHH:MM:SS');

    const barang = await BarangService.List();

    if (result.error)
        return res.status(400).send({ status: 400, error: result.error });
    else
        return res.render('pages/transaksi/barang_keluar/edit', {
            page: 'barang_keluar',
            user: req.user,
            result,
            barang,
            tanggal_input
        });
});

router.post('/barang_keluar/export', isAuthenticated, async (req, res, next) => {
    const barangData = req.body;

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
                label: 'Jumlah',
                value: 'jumlah'
            },
            {
                label: 'Total Harga',
                value: 'total_harga'
            },
            {
                label: 'Tanggal Input',
                value: 'tanggal_input'
            }
        ]
    }   

    const csvData = await BarangKeluarService.GetHistoryData(barangData);
    const json2csvParser = new Parser(options);
    const result = json2csvParser.parse(csvData);
    const target = `./public/assets/upload/files/Barang-keluar-${moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')}.csv`;
    fs.writeFileSync(target, result);
    res.download(target);
});

module.exports = router;
