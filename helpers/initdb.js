const { hashPassword } = require('./password');
const { User } = require('../models');

function initDB () {
    new Promise(async (resolve, reject) => {
        console.log('Init Roles');
        try {
            const userData = await User.findOne({});
            if (!userData) {
                await User.create({
                    username: 'admin',
                    password: await hashPassword('admin123'),
                    fullname: 'Administrator',
                    email: null,
                    enabled: 1
                })
                // await User.create({
                //     username: 'adminbackup',
                //     password: await hashPassword('admin123'),
                //     fullname: 'Administrator Backup',
                //     email: null,
                //     enabled: 1
                // })
            }
            resolve(true);
        } catch (error) {
            console.log('error', error);
            reject(error);
        }
    })
}

module.exports = { initDB }