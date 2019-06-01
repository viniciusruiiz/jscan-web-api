import { Strategy } from 'passport-jwt';
import sql from 'mssql';
import options from '../config/token'

const strategy = new Strategy(options, (payload, done) => {
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

export default strategy;