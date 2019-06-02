const port = process.env.PORT || "3000";

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const sql = require('mssql');
const cors = require('cors');

const sqlConfig = require('./config/database');
const authStrategy = require('./auth/stategy');

const auth = require('./routes/auth');
const users = require('./routes/users');
const company = require('./routes/company');
const api = require('./routes/api');
const pc = require('./routes/pc');
const read = require('./routes/read');

console.log("Ligando a api...")

sql.connect(sqlConfig("jscanserver.database.windows.net", "jscandb", 
"adm_jscan", "Y33bkxs9@"))
    .then((connection) => {
        global.conn = connection;
        console.log("Conectado ao banco de dados " +"jscandb");

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

        app.listen(port, () => {
            console.log('API online! porta: ' + port);
        })
    });