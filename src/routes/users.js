const express = require('express');
const passport = require('passport');
const database = require('../data/database');
const hashCode = require('../config/hash');

const router = express();

router.get('/getByManager/:idGst', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`   
SELECT F.NMFUNCIONARIO AS name
,      C.IDCOMPUTADOR AS idPc 
,      C.NMCOMPUTADOR AS pcName
,      C.NMSISTEMAOPERACIONAL AS pcOperatingSystem
,      C.NMPROCESSADOR AS pcProcessor
,      C.VLMEMORIARAM AS pcMemory
,      C.VLARMAZENAMENTO AS pcStorage
  FROM TB_FUNCIONARIO F
,      TB_COMPUTADOR  C 
 WHERE F.IDFUNCIONARIO = C.IDFUNCIONARIO 
   AND IDGESTOR = ${req.params.idGst}`, res);
});

router.get('/get/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT * FROM TB_FUNCIONARIO FN INNER JOIN TB_COMPUTADOR PC ON FN.IDFUNCIONARIO = PC.IDFUNCIONARIO WHERE FN.IDFUNCIONARIO = ${req.params.id}`, res);
});

router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {

    if (req.body.idEmpresa && req.body.nomeFuncionario &&
        req.body.email && req.body.senha &&
        req.body.phone && req.body.type) {

        console.log(req.body.idEmpresa, req.body.nomeFuncionario,
            req.body.email, req.body.senha,
            req.body.phone, req.body.type)

        database.CreateEmployer(req.body.idEmpresa, req.body.type == 2 || req.body.type == "2" ? req.body.idGestor : null,
            req.body.nomeFuncionario, req.body.email, hashCode(req.body.senha),
            req.body.phone, req.body.type, res);
    }

    else {
        res.json([{ "message": "Por favor, insira todos os campos obrigarórios!", "success": 0 }])
    }
});

router.post('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    database.DeleteUser(req.params.id, res);
});

module.exports = router;