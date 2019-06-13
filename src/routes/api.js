const express = require('express');
const passport = require('passport');
const database = require('../data/database');

const router = express();

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT * FROM TB_API WHERE IDAPI = ${req.params.id}`, res);
});

router.get('/list/:idGst', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`
SELECT A.idapi as id
,      A.nmApi as name
,      A.nmEndPoint as endPoint
,      (SELECT TOP 1 L.ATIVO
        FROM TB_LEITURA_API L
        WHERE L.IDAPI = A.IDAPI
        ORDER BY L.IDLEITURA DESC) as status
  FROM TB_API A
,      TB_API_FUNCIONARIO AF
 WHERE AF.IDAPI = A.IDAPI
   AND AF.IDFUNCIONARIO = '${req.params.idGst}'`, res);
});

router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.idGestor && req.body.name &&
        req.body.type && req.body.endPoint) {

        database.CreateApi(req.body.idGestor,
            req.body.name,
            req.body.type,
            !!req.body.description ? req.body.description : null, //valida se a algo no campo da descrição, que é um campo não obrigatório
            req.body.endPoint,
            res);
    } else {
        res.json([{ "message": "Por favor, insira todos os campos obrigarórios!", "success": 0 }])
    }
});

router.post('/delete/:idGestor/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.DeleteApi(req.params.id, req.params.idGestor);
});

module.exports = router;
