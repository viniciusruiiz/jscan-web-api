// require('dotenv-safe').config();
const sql = require('mssql');
const sqlConfig = require('../config/database');

module.exports = {
    queryFromRoute: (SqlQuery, res) => {
        global.conn.request()
            .query(SqlQuery)
            .then(result => {
                console.log(result.recordset)
                result.recordset.success = true;
                res.json(result.recordset)
            }).catch(err => {
                console.error(err)
            })
    },
    CreateCompany: (nomeEmpresa, cnpj, nomeFuncionario, email, senha, telefone, res) => {

        let connection = new sql.ConnectionPool(sqlConfig("jscanserver.database.windows.net",
            "jscandb",
            "adm_jscan",
            "Y33bkxs9@"));

        connection.connect().then(conn => {
            let request = new sql.Request(conn)
            request.input('NMEMPRESA', nomeEmpresa)
            request.input('CDCNPJ', cnpj)
            request.input('NMFUNCIONARIO', nomeFuncionario)
            request.input('NMEMAILFUNCIONARIO', email)
            request.input('NMSENHAFUNCIONARIO', senha)
            request.input('NRTELEFONEFUNCIONARIO', telefone)
            request.execute('CAD_EMPRESA')
                .then(result => {
                    res.json(result.recordset)
                })
        }).catch(err => {
            console.error(err)
        })
    },
    CreateEmployer: (idEmpresa, idGestor, nome, email, senha, telefone, tipo, res) => {

        let connection = new sql.ConnectionPool(sqlConfig("jscanserver.database.windows.net",
            "jscandb",
            "adm_jscan",
            "Y33bkxs9@"));

        connection.connect().then(conn => {
            let request = new sql.Request(conn)
            request.input('IDEMPRESA', idEmpresa)
            request.input('IDGESTOR', idGestor)
            request.input('NMFUNCIONARIO', nome)
            request.input('NMEMAILFUNCIONARIO', email)
            request.input('NMSENHAFUNCIONARIO', senha)
            request.input('NRTELEFONE', telefone)
            request.input('TPFUNCIONARIO', tipo)
            request.execute('CAD_FUNCIONARIO')
                .then(result => {
                    res.json(result.recordset)
                    connection.close();
                })
        }).catch(err => {
            console.error(err)
        })
    },
    CreateApi: (idGestor, nome, tipo, descricao, endPoint, res) => {

        let connection = new sql.ConnectionPool(sqlConfig("jscanserver.database.windows.net",
            "jscandb",
            "adm_jscan",
            "Y33bkxs9@"));

        connection.connect().then(conn => {
            let request = new sql.Request(conn)
            request.input('IDGESTOR', idGestor)
            request.input('NMAPI', nome)
            request.input('DSAPI', descricao)
            request.input('TPAPI', tipo)
            request.input('ENDPOINT', endPoint)
            request.execute('CAD_API')
                .then(result => {
                    res.json(result.recordset)
                    connection.close();
                })
        }).catch(err => {
            console.error(err)
        })
    },
    DeleteApi: (idApi, idGestor, res) => {

        let connection = new sql.ConnectionPool(sqlConfig("jscanserver.database.windows.net",
            "jscandb",
            "adm_jscan",
            "Y33bkxs9@"));

        connection.connect().then(conn => {
            let request = new sql.Request(conn)
            request.input('IDAPI', idApi)
            request.input('IDGST', idGestor)
            request.execute('DEL_API')
                .then(result => {
                    res.json(result.recordset)
                    connection.close();
                })
        }).catch(err => {
            console.error(err)
        })
    },
    DeleteUser: (idUser, res) => {

        let connection = new sql.ConnectionPool(sqlConfig("jscanserver.database.windows.net",
            "jscandb",
            "adm_jscan",
            "Y33bkxs9@"));

        connection.connect().then(conn => {
            let request = new sql.Request(conn)
            request.input('IDUSER', idUser)
            request.execute('DEL_USER')
                .then(result => {
                    res.json(result.recordset)
                    connection.close();
                })
        }).catch(err => {
            console.error(err)
        })
    }
}
