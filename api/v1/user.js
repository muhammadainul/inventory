const express = require('express');
const router = express.Router();

const passport = require('passport');
const { Parser } = require("json2csv");
const fs = require('fs')

const debug = require('debug');
const log = debug('inventory:user:');

const UserService = require('../../services/user');
const moment = require('moment');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
};

router.post('/register', isAuthenticated, async (req, res, next) => {
    const userData = req.body;

    const result = await UserService.SignUp(userData);
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

router.post('/login', async (req, res, next) => {
    const userData = req.body;

    const result = await UserService.SignIn(userData);
    log('result', result);

    if (result.error) return res.json({ status: 400, data: result.error });
    else
        passport.authenticate('local', (err, user, info) => {
            log('err, user', { err, user, info });
            if (err) return res.send(err);
            if (!user) return res.redirect('/');
            req.logIn(user, { session: true }, (err) => {
                if (err) return res.send(err);
                return res.json({ status: 200, data: result.message });
            });
        })(req, res, next);
});

router.post('/update', isAuthenticated, async (req, res, next) => {
    const userData = req.body;
    const user = req.user;

    const result = await UserService.UpdateProfile(userData, user);
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

router.post('/delete', isAuthenticated, async (req, res, next) => {
    const userData = req.body;

    const result = await UserService.Delete(userData);
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

router.post('/datatables', isAuthenticated, async (req, res, next) => {
    const userData = req.body;

    const result = await UserService.GetDatatables(userData);
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

router.get('/edit/:id', isAuthenticated, async (req, res, next) => {
    const user_id = req.params.id;

    const result = await UserService.Get(user_id);
    log('result', result);

    if (result.error) {
        return res.status(400).send({ 
            status: 400, 
            error: result.error 
        });
    } else {
        return res.render('pages/user/edit', {
            page: 'user',
            user: req.user,
            result
        });
    }
});

router.get('/logout', async (req, res, next) => {
    log('logout', req.user);

    // socket.emit('logout', req.user);

    req.logout();
    res.redirect('/');
});

router.post('/password/update', isAuthenticated, async (req, res, next) => {
    const userData = req.body;

    const result = await UserService.UpdatePassword(userData);
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
    const userData = req.body;

    const options = {
        defaultValue : "none",
        fields : [
            {
                label: 'ID',
                value: 'id'
            },
            {
                label: 'Username',
                value: 'username'
            },
            {
                label: 'Nama Depan',
                value: 'nama_depan'
            },
            {
                label: 'Nama Belakang',
                value: 'nama_belakang'
            },
            {
                label: 'Email',
                value: 'email'
            },
            {
                label: 'Tanggal Lahir',
                value: 'tempat_lahir'
            },
            {
                label: 'Jenis Kelamin',
                value: 'jenis_kelamin'
            }
        ]
    }   

    const csvData = await UserService.GetHistoryData(userData);
    const json2csvParser = new Parser(options);
    const result = json2csvParser.parse(csvData);
    const target = `./public/assets/upload/files/Master-${moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')}.csv`;
    fs.writeFileSync(target, result);
    res.download(target);
});

module.exports = router;
