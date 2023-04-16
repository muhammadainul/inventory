const { isEmpty, toInteger } = require('lodash');
const crypto = require('crypto');
const moment = require('moment');

const { Op } = require('sequelize'); 

const debug = require('debug');
const log = debug('inventory:services');

const { User } = require('../models');

async function hashPassword(password) {
    log('hashPassword', { password });
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(8).toString('hex');

        crypto.scrypt(password, salt, 64, (err, key) => {
            if (err) reject(err);
            resolve(salt + ':' + key.toString('hex'));
        });
    });
}

async function verifyPassword(password, hash) {
    log('verifyPassword', { password, hash });
    return new Promise((resolve, reject) => {
        const [salt, hashKey] = hash.split(':');
        crypto.scrypt(password, salt, 64, (err, key) => {
            if (err) reject(err);
            resolve(hashKey == key.toString('hex'));
        });
    });
}

async function SignUp (userData) {
    const { 
        username, 
        nama_depan,
        nama_belakang,
        email,
        jenis_kelamin,
        ttl,
        password, 
        repassword,
        enabled = true
    } = userData;
    log('[User] SignUp', userData);
    try {
        if (!username || !password || !repassword || !enabled) throw { error: 'Form harus diisi.' };

        const checkUser = await User.findOne({
            where: { username: { [Op.like]: `%${username}%` } },
            raw: true
        });
        if (checkUser) throw { error: 'Username sudah tersedia.' }; 

        const checkEmail = await User.findOne({
            where: { email: { [Op.like]: `%${email}%` } },
            raw: true
        });
        if (checkEmail) throw { error: 'Email sudah tersedia.' }; 

        if (password !== repassword) throw { error: 'Password tidak cocok.' };

        const created = await User.create({
            username, 
            nama_depan,
            nama_belakang,
            email,
            jenis_kelamin,
            tempat_lahir: ttl,
            password: await hashPassword(password),
            enabled
        });

        return {
            message: 'User berhasil ditambah.',
            user: created
        };
    } catch (error) {
        return error;
    }
}

async function SignIn (userData) {
    const { username, password } = userData;
    log('[User] SignIn', userData);
    try {
        const checkUser = await User.findOne({
            where: {
                username,
                enabled: 1
            },
            raw: true
        });
        if (!checkUser) 
            throw { error: 'User tidak tersedia atau tidak aktif. Silahkan menghubungi adminstrator' };

        const checkPassword = await verifyPassword(
            password,
            checkUser.password
        );
        if (!checkUser || !checkPassword)
            throw { error: 'Username atau password salah.' };

        // socket.emit('login', checkUser);

        return {
            message: `Login berhasil. Selamat datang ${checkUser.username}`,
            user: checkUser
        };
    } catch (error) {
        return error;
    }
}

async function UpdateProfile (userData, user) {
    const { 
        user_id,
        username, 
        nama_depan,
        nama_belakang,
        email,
        ttl,
        jenis_kelamin, 
        enabled,
        profile = false 
    } = userData;
    log('[User] UpdateProfile', { userData, user });
    try {
        if (profile) {
            if (user_id !== user.id) throw { error: 'Update user gagal. Maaf ini bukan akun anda.' };

            const checkUser = await User.findOne({
                where: { id: user_id },
                raw: true
            });
            if (!checkUser) throw { error: 'User tidak tersedia.' };

            if (checkUser.username !== username) {
                const checkUsername = await User.findOne({
                    where: { username: { [Op.like]: `%${username}%` } },
                    raw: true
                });
                if (checkUsername) throw { error: 'Username sudah tersedia.' };
            }

            if (checkUser.email !== email) {
                const checkEmail = await User.findOne({
                    where: { email: { [Op.like]: `%${email}%` } },
                    raw: true
                });
                if (checkEmail) throw { error: 'Email sudah tersedia.' };
            }

            await User.update({ 
                username,
                nama_depan,
                nama_belakang,
                email,
                tempat_lahir: ttl,
                jenis_kelamin, 
                enabled 
                },
                { where: { id: user_id } }
            );
        } else {
            if (!user_id) throw { error: 'Update user gagal.' };

            await User.update({ enabled }, { where: { id: user_id } });
        }
    
        return {
            message: 'User berhasil diubah.',
            user: await User.findOne({ 
                where: { id: user_id }, 
                raw: true 
            })
        };
    } catch (error) {
        return error;
    }
}

async function UpdatePassword (userData) {
    const { 
        user_id, 
        old_password, 
        password, 
        repassword 
    } = userData;
    log('[User] UpdatePassword', userData);
    try {
        if (!user_id) throw { error: 'Update password gagal.' };

        const checkUser = await User.findOne({
            where: { id: user_id },
            raw: true
        });
        if (!checkUser) throw { error: 'User tidak tersedia.' };
        const passwordCheck = await verifyPassword(
            old_password,
            checkUser.password
        );
        if (!passwordCheck) throw { error: 'Password lama tidak sesuai.' };

        if (password !== repassword) throw { error: 'Password tidak cocok.' };

        await User.update({ 
            password: await hashPassword(password)
            }, 
            { where: { id: user_id } });
            
        return {
            message: 'Password berhasil diubah.',
            user: await User.findOne({ 
                where: { id: user_id }, 
                raw: true 
            })
        };
    } catch (error) {
        return error;
    }
}

async function Delete (userData) {
    const { user_id } = userData;
    log('[User] Delete', userData);
    try {
        const checkUser = await User.findOne({ 
            where: { id: user_id },
            raw: true
        })
        if (!checkUser) throw { error: 'User tidak tersedia.' };
        
        await User.destroy({ where: { id: user_id }});
       
        return {
            message: 'User berhasil dihapus.'
        };
    } catch (error) {
        return error;
    }
}

async function GetDatatables (userData) {
    const { 
        draw, 
        order, 
        start, 
        length, 
        search,
        start_date,
        end_date,
        user_id 
    } = userData;
    log('[User] GetDatatables', userData);
    try {
        let whereBySearch;
        !isEmpty(search.value)
            ? (whereBySearch = {
                [Op.or]: {
                    username: { 
                        [Op.like]: `%${search.value}%`
                    },
                    nama_depan: {
                        [Op.like]: `%${search.value}%`
                    },
                    nama_belakang: {
                        [Op.like]: `%${search.value}%`
                    },
                    email: {
                        [Op.like]: `%${search.value}%`
                    },
                    jenis_kelamin: {
                        [Op.like]: `%${search.value}%`
                    }
                }
            })
            : (whereBySearch = {});
        
        let searchOrder;
        if (!isEmpty(order)) {
            if (order[0].column === '5') {
                searchOrder = [['createdAt', order[0].dir]];
            } else {
                searchOrder = [['createdAt', 'desc']];
            }
        }

        let whereByDate;
        (start_date || end_date) 
            ?
            (whereByDate = {
                [Op.and]: [
                    { createdAt: { [Op.gte]: moment(start_date).format() } },
                    { createdAt: { [Op.lte]: moment(end_date).format() } }
                ]
            })
            :
            (whereByDate = {});

        const where = {
            ...whereBySearch,
            ...whereByDate
        };

        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            User.count({}),
            User.count({ where }),
            User.findAll({
                where: {
                    [Op.and]: [
                        where,
                        { id: { [Op.ne]: user_id } }
                    ]
                },
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

async function Get (user_id) {
    log('[User] Get', user_id);
    try {
        const checkUser = await User.findOne({ 
            where: { id: user_id },
            raw: true
        });
        if (!checkUser) throw { error: 'User tidak tersedia.' };
        
        return checkUser
    } catch (error) {
        return error;
    }
}

async function GetHistoryData (userData) {
    const { 
        start_date, 
        end_date,
    } = userData;
    log('[User] GetHistoryData', userData);
    try {
        const data = await User.findAll({
            attributes: [
                'id', 
                'username', 
                'nama_depan', 
                'nama_belakang', 
                'email',
                'jenis_kelamin',
                'tempat_lahir'
            ],
            where: {
                [Op.and]: [
                    { createdAt: { [Op.gte]: moment(start_date).format() } },
                    { createdAt: { [Op.lte]: moment(end_date).format() } }
                ]
            },
            order: [['createdAt', 'desc']],
            raw: true 
        });
        
        return data;
    } catch (error) {
        return error;
    }
}

module.exports = {
    SignIn,
    SignUp,
    UpdateProfile,
    UpdatePassword,
    Delete,
    GetDatatables,
    Get,
    GetHistoryData
}