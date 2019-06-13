const express = require('express');
const passport = require('passport');
const database = require('../data/database');
const hashCode = require('../config/hash');

const router = express.Router();

router.post('/add', (req, res) => {

    if (req.body.nomeEmpresa && req.body.cnpj && req.body.nomeFuncionario && req.body.email && req.body.senha && req.body.phone) {

        let nomeEmpresa = req.body.nomeEmpresa,
            cnpj = req.body.cnpj,
            nomeFuncionario = req.body.nomeFuncionario,
            email = req.body.email,
            nomeSenha = hashCode(req.body.senha),
            numeroTelefoneFuncionario = req.body.phone

        database.CreateCompany(nomeEmpresa, cnpj, nomeFuncionario, email, nomeSenha, numeroTelefoneFuncionario, res)

    } else {
        res.json([{ "message": 'Preencha todos os campos obrigatórios!', "success": 0 }])
    }
});

router.get('/users/get/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    database.queryFromRoute(`
        SELECT F.IDFUNCIONARIO AS id
        ,      F.NMFUNCIONARIO AS name
        ,      F.IDTIPO AS type
        ,      F.NMEMAIL AS email
        ,      F.NRTELEFONE AS phone
          FROM TB_FUNCIONARIO F 
         WHERE IDEMPRESA = ${req.params.id}
           AND IDTIPO != 3`, res)

});

router.get('/manager/list/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    database.queryFromRoute(`
    SELECT *
      FROM TB_FUNCIONARIO
     WHERE IDEMPRESA = ${req.params.id}
       AND IDTIPO = 1`, res)

});

module.exports = router;