const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('inventory:index:');

const KategoriService = require('../../services/kategori');
const BarangService = require('../../services/barang');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
};

router.post('/login', async (req, res, next) => {
    res.redirect('dashboard');
});

router.get('/', async (req, res, next) => {
    res.render('pages/login');
});

router.get('/dashboard', isAuthenticated, async (req, res, next) => {
    res.render('pages/dashboard', {
        page: 'dashboard',
        user: req.user
    });
});

router.get('/master_data', isAuthenticated, async (req, res, next) => {
    const kategori = await KategoriService.List();

    res.render('pages/master', {
        page: 'master_data',
        user: req.user,
        kategori
    });
});

router.get('/master_data/tambah', isAuthenticated, async (req, res, next) => {
    const result = await KategoriService.List();
    log('result', result);

    res.render('pages/master/tambah', {
        page: 'master_data',
        user: req.user,
        result  
    });
});

router.get('/kategori', isAuthenticated, async (req, res, next) => {
    res.render('pages/kategori', {
        page: 'kategori',
        user: req.user
    });
});

router.get('/kategori/tambah', isAuthenticated, async (req, res, next) => {
    res.render('pages/kategori/tambah', {
        page: 'kategori',
        user: req.user
    });
});

router.get('/transaksi/barang_masuk', isAuthenticated, async (req, res, next) => {
    const result = await KategoriService.List();
    log('result', result);

    res.render('pages/transaksi/barang_masuk', {
        page: 'barang_masuk',
        user: req.user,
        result
    });
});

router.get('/transaksi/barang_masuk/tambah', isAuthenticated, async (req, res, next) => {
    const barang = await BarangService.List();

    const result = await KategoriService.List();
    log('result', result);

    res.render('pages/transaksi/barang_masuk/tambah', {
        page: 'barang_masuk',
        user: req.user,
        result,
        barang
    });
});

router.get('/transaksi/barang_keluar', isAuthenticated, async (req, res, next) => {
    res.render('pages/transaksi/barang_keluar', {
        page: 'barang_keluar',
        user: req.user
    });
});

router.get('/transaksi/barang_keluar/tambah', isAuthenticated, async (req, res, next) => {
    const barang = await BarangService.List();

    const result = await KategoriService.List();
    log('result', result);

    res.render('pages/transaksi/barang_keluar/tambah', {
        page: 'barang_keluar',
        user: req.user,
        result,
        barang
    });
});

router.get('/user', isAuthenticated, async (req, res) => {
    res.render('pages/user', {
        page: 'user',
        user: req.user
    });
});

router.get('/user/tambah', isAuthenticated, async (req, res) => {
    res.render('pages/user/tambah', {
        page: 'user',
        user: req.user
    });
});

router.get('/user/ubah', isAuthenticated, async (req, res) => {
    res.render('pages/user/edit', {
        page: 'user',
        user: req.user
    });
});

router.get('/user/profile', isAuthenticated, async (req, res) => {
    res.render('pages/user/profile', {
        page: 'profile',
        user: req.user
    });
});

router.get('/transaksi/barang_keluar/tambah', isAuthenticated, async (req, res, next) => {
    const barang = await BarangService.List();

    const result = await KategoriService.List();
    log('result', result);

    res.render('pages/transaksi/barang_keluar/tambah', {
        page: 'barang_keluar',
        user: req.user,
        result,
        barang
    });
});

router.get('/laporan', isAuthenticated, async (req, res, next) => {
    const kategori = await KategoriService.List();

    res.render('pages/laporan', {
        page: 'laporan',
        user: req.user,
        kategori
    });
});

module.exports = router;
