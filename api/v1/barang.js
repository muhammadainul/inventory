const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('inventory:barang:');

const { Parser } = require("json2csv");
const fs = require('fs');
const moment = require('moment');

const KategoriService = require('../../services/kategori');
const BarangService = require('../../services/barang');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
};

router.post('/datatables', isAuthenticated, async (req, res) => {
    const barangData = req.body;

    const result = await BarangService.GetDatatables(barangData);
    log('result', result);

    if (result.error) {
        return res.json({ status: 400, error: result.error });
    } else { 
        return res.status(200).json(result).data;
    }
});

router.post('/add', isAuthenticated, async (req, res) => {
    const files = req.file;
    const barangData = req.body;

    const result = await BarangService.Create(files, barangData);
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

router.post('/update', isAuthenticated, async (req, res) => {
    const files = req.file;
    const barangData = req.body;

    const result = await BarangService.Update(files, barangData);
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

router.post('/delete', isAuthenticated, async (req, res) => {
    const barangData = req.body;

    const result = await BarangService.Delete(barangData);
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

router.get('/list', isAuthenticated, async (req, res) => {
    const result = await BarangService.List();
    log('result', result);

    if (result.error) {
        return res.status(400).send({ 
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

router.get('/edit/:id', isAuthenticated, async (req, res) => {
    const barang_id = req.params.id;

    const kategori = await KategoriService.List();

    const result = await BarangService.Get(barang_id);
    log('result', result);

    const tanggal_input = moment(result.tanggal_input).format('YYYY-MM-DD hh:mm:ss');

    if (result.error)
        return res.status(400).send({ status: 400, error: result.error });
    else
        return res.render('pages/master/edit', {
            page: 'master',
            user: req.user,
            kategori,
            result,
            tanggal_input
        });
});

router.post('/export', isAuthenticated, async (req, res, next) => {
    const barangData = req.body;

    const options = {
        defaultValue : "none",
        fields : [
            {
                label: 'Kode Barang',
                value: 'kode_barang'
            },
            {
                label: 'Nama Barang',
                value: 'nama_barang'
            },
            {
                label: 'Kategori',
                value: 'kategori.kategori'
            },
            {
                label: 'Keterangan',
                value: 'keterangan'
            },
            {
                label: 'Harga Beli',
                value: 'harga_beli'
            },
            {
                label: 'Harga Jual',
                value: 'harga_jual'
            },
            {
                label: 'Tanggal Input',
                value: 'tanggal_input'
            }
        ]
    }   

    const csvData = await BarangService.GetHistoryData(barangData);
    const json2csvParser = new Parser(options);
    const result = json2csvParser.parse(csvData);
    const target = `./public/assets/upload/files/Master-${moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')}.csv`;
    fs.writeFileSync(target, result);
    res.download(target);
});

module.exports = router;
