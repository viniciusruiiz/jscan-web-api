const passportJwt = require('passport-jwt');

const options = require('../config/token');

const strategy = new passportJwt.Strategy(options, (payload, done) => {
    global.conn.request()
        .query(`SELECT idFuncionario FROM TB_FUNCIONARIO WHERE idFuncionario = '${payload.id}'`)
        .then(user => {

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }).catch(err => {
            return done(err, null);
        });
});

module.exports = strategy;