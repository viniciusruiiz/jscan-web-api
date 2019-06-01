const express = require('express');
const passport = require('passport');
const database = require('../data/database');

const router = express();

router.get('/pc/cpu/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    database.queryFromRoute(`SELECT TOP(10) vlLeituraCpu, CONVERT(VARCHAR(11), dtregistro,108) as dtregistro FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/ram/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    database.queryFromRoute(`select top 1 round((vlLeituraMemoria / 1000000000), 2)
         as vlLeituraMemoria  FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/disk/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    database.queryFromRoute(`select top 1 
        round((vlleituraarmazenamento / 1000000000), 2) as vlleituraarmazenamento 
            from tb_leitura_pc WHERE IDCOMPUTADOR = ${req.params.id} 
                ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/processnumber/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    database.queryFromRoute(`SELECT TOP(10) vlProcesso as result FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/uptime/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    database.queryFromRoute(`SELECT TOP(10) tpAtividade as result FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/totalDiskRam/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    database.queryFromRoute(`select top 1 vlmemoriaram, vlarmazenamento 
    from tb_computador
        where idcomputador =  ${req.params.id}`, res);
});

router.get('/pc/cpu/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    database.queryFromRoute(`SELECT TOP(10) vlLeituraCpu as result FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/diskreadavarage/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    database.queryFromRoute(`SELECT TOP(10) mdLeituraDisco as result FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/api/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    database.queryFromRoute(`SELECT TOP(10) * FROM TB_LEITURA_API WHERE IDAPI = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

module.exports = router;