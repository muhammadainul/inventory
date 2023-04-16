const debug = require('debug');
const { User } = require('../models');
const { Op } = require('sequelize');
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;

async function verifyPassword(password, hash) {
    const log = debug('password:');
    log('verify', { password, hash });
    return new Promise((resolve, reject) => {
        const [salt, hashKey] = hash.split(':');
        crypto.scrypt(password, salt, 64, (err, key) => {
            if (err) reject(err);
            resolve(hashKey == key.toString('hex'));
        });
    });
}

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        const log = debug('passport:serializeUser');
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        const log = debug('passport:deserializeUser');
        console.log('deserializeUser', id);
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    });

    // local strategy
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            const log = debug('passport:');
            log('LocalStrategy', { username, password });
            try {
                const user = await User.findOne({
                    where: { username },
                    raw: true
                });
                log('response', user);
                if (!user) return done(null, false);
                if (!verifyPassword(password, user.password))
                    return done(null, false);
                return done(null, user);
            } catch (error) {
                done(error);
            }
        })
    );
};
