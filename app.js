const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const moment = require('moment');
const session = require('express-session');
const passport = require('passport');

// const io = require('socket.io-client');
// global.socket = io('http://localhost:3000', { transports : ['websocket'] });

require('dotenv').config();

const multerMiddleware = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null,  "./public/assets/upload/images")
        },
        filename: (req, file, cb) => {
            cb(null, moment(Date.now()).format('YYYY-MM-DD hh:mm:ss') + '-barang' + path.extname(file.originalname))
        }
    }),
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});

app.disable('x-powered-by');
app.use(
    multerMiddleware.single('files')
);

if (!fs.existsSync('./views')) fs.mkdirSync('./views')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

if (!fs.existsSync('./public')) fs.mkdirSync('./public')
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

// app.use(function (req, res, next){
//     req.io = io;
//     next();
// });

const { initDB } = require('./helpers/initdb');
initDB();

// session
app.use(session({
    secret  : crypto.randomBytes(50).toString('hex'),
    cookie  : { maxAge : 7200000 },
    resave  : false,
    saveUninitialized  : false
}))
require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/', require('./api/v1/index'));
app.use('/master_data', require('./api/v1/barang'));
app.use('/laporan', require('./api/v1/laporan'));
app.use('/transaksi', require('./api/v1/transaksi'));
app.use('/user', require('./api/v1/user'));
app.use('/kategori', require('./api/v1/kategori'));

module.exports = app;
