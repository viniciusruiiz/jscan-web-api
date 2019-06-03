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
        res.json({ "message": 'Preencha todos os campos obrigatórios!' })
    }
});

router.get('/get/:id', passport.authenticate('jwt', {session: false}), (req, res) => {

    if (req.params.id) {
    let id = req.params.id;

        database.queryFromRoute(`select * from tb_funcionario where 
            idempresa = ${id} and idtipo != 3`, res)

    } else {
        res.json({ "message": 'Erro ao retornar funcionarios!' })
    }
});

router.get('/manager/list/:id', passport.authenticate('jwt', {session: false}), (req, res) => {

    database.queryFromRoute(`
    SELECT *
      FROM TB_FUNCIONARIO
     WHERE IDTIPO = 1
       AND IDEMPRESA = ${req.params.id}`, res)
});

module.exports = router;