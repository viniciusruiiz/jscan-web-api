const passportJwt = require('passport-jwt')

module.exports = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "SEGREDOSECRETOSEGREDO"
};