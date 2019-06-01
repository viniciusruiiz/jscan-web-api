require('dotenv-safe').config();

import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import passport from 'passport';
import sql from 'mssql';
import cors from 'cors';

import sqlConfig from './config/database';
import authStrategy from './auth/stategy';

import auth from './routes/auth';
import users from './routes/users';
import company from "./routes/company";
import api from './routes/api';
import pc from './routes/pc';
import read from './routes/read';

console.log("Ligando a api...")

sql.connect(sqlConfig(process.env.DB_HOST, process.env.DB_NAME, 
    process.env.DB_USER, process.env.DB_PASSWORD))
    .then((connection) => {
        global.conn = connection;
        console.log("Conectado ao banco de dados " + process.env.DB_NAME);

        const app = express();

        passport.use(authStrategy);

        app.use(cors());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(logger('dev'));
        app.use(passport.initialize());

        //routes
        app.use('/auth', auth);
        app.use('/users', users);
        app.use('/company', company);
        app.use('/pc', pc);
        app.use('/api', api);
        app.use('/read', read);

        app.listen(process.env.PORT, () => {
            console.log('API online! porta: ' + process.env.PORT);
        });
    });