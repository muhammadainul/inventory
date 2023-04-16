const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('inventory:kategori:');

const KategoriService = require('../../services/kategori');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
};

router.post('/datatables', isAuthenticated, async (req, res, next) => {
    const kategoriData = req.body;

    const result = await KategoriService.GetDatatables(kategoriData);
    log('result', result);

    if (result.error) {
        return res.status(400).send({ 
            status: 400, 
            error: result.error 
        });
    } else {
        return res.status(200).json(result).data;
    }
});

router.post('/add', isAuthenticated, async (req, res, next) => {
    const kategoriData = req.body;

    const result = await KategoriService.Create(kategoriData);
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

router.post('/update', isAuthenticated, async (req, res, next) => {
    const kategoriData = req.body;

    const result = await KategoriService.Update(kategoriData);
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

router.post('/delete', isAuthenticated, async (req, res, next) => {
    const kategoriData = req.body;

    const result = await KategoriService.Delete(kategoriData);
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

router.get('/list', isAuthenticated, async (req, res, next) => {
    const result = await KategoriService.List();
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

router.get('/edit/:id', isAuthenticated, async (req, res, next) => {
    const kategori_id = req.params.id;

    const result = await KategoriService.Get(kategori_id);
    log('result', result);

    if (result.error) {
        return res.status(400).send({ 
            status: 400, 
            error: result.error 
        });
    } else {
        return res.render('pages/kategori/edit', {
            page: 'kategori',
            user: req.user,
            result
        });
    }
});

module.exports = router;
