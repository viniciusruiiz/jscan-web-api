const express = require('express');
const passport = require('passport');
const database = require('../data/database');

const router = express();

router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    database.queryFromRoute(`SELECT * FROM TB_API WHERE IDAPI = ${req.params.id}`, res);
});

router.get('/list/:idGst', passport.authenticate('jwt', {session: false}), (req, res) => {
    database.queryFromRoute(`select top 1 a.idapi, a.dsapi, a.nmApi, a.idtipoapi, a.idfuncionario, l.ativo from tb_api a 
                                inner join tb_leitura_api l 
                                    on a.idapi = l.idapi
                                        INNER JOIN TB_API_FUNCIONARIO FUN_API
                                            ON a.IDAPI = FUN_API.IDAPI
                                                INNER JOIN TB_FUNCIONARIO F
                                                    ON F.idFuncionario = FUN_API.idFuncionario
                                                        WHERE F.IDGESTOR = ${req.params.idGst}
                                                            order by l.idleitura desc`, res);
});

router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(req.body.idGestor && req.body.name && 
        req.body.type && req.body.endPoint){

            database.CreateApi(req.body.idGestor,
                req.body.name,
                req.body.type,
                !!req.body.description ? req.body.description : null, //valida se a algo no campo da descrição, que é um campo não obrigatório
                req.body.endPoint,);
    } else {
        res.json({ "message": "Por favor, insira todos os campos obrigarórios!" })
    }

});

module.exports = router;