import envoriment from 'dotenv-safe';
import { ExtractJwt } from 'passport-jwt';

//setando as variáveis de ambiente, que não conseguiam ser 'vistas' daqui sem isso
envoriment.config();

export default {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "SEGREDOSECRETOSEGREDO"
};