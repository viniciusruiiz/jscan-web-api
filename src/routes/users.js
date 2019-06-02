const express = require('express');
const passport = require('passport');
const database = require('../data/database');
const hashCode = require('../config/hash');

const router = express();

router.get('/getList/:idGst', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT * FROM TB_FUNCIONARIO FN INNER JOIN TB_COMPUTADOR PC ON FN.IDFUNCIONARIO = PC.IDFUNCIONARIO WHERE IDGESTOR = ${req.params.idGst}`, res);
});

router.get('/get/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT * FROM TB_FUNCIONARIO FN INNER JOIN TB_COMPUTADOR PC ON FN.IDFUNCIONARIO = PC.IDFUNCIONARIO WHERE FN.IDFUNCIONARIO = ${req.params.id}`, res);
});

router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {

    if (req.body.idEmpresa && req.body.nomeFuncionario && 
        req.body.email && req.body.senha &&
        req.body.phone && req.body.type) {

        database.CreateEmployer(req.body.idEmpresa, req.body.type == 1 || req.body.type == "1" ? null : req.body.idGestor,
            req.body.nomeFuncionario, req.body.email, hashCode(req.body.senha),
            req.body.phone, req.body.type, res);
    }

    else {
        res.json({ "message": "Por favor, insira todos os campos obrigarórios!" })
    }
});

router.post('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    database.queryFromRoute(`DELETE FROM TB_FUNCIONARIO
    WHERE IDFUNCIONARIO = ${req.params.id}`)
});

module.exports = router;