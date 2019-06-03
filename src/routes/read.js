const express = require('express');
const passport = require('passport');
const database = require('../data/database');

const router = express();

router.get('/pc/cpu/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT TOP(10) vlLeituraCpu, CONVERT(VARCHAR(11), dtregistro,108) as dtregistro FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/ram/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`select top 1 round((vlLeituraMemoria / 1000000000), 2)
         as vlLeituraMemoria  FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/disk/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`select top 1 
        round((vlleituraarmazenamento / 1000000000), 2) as vlleituraarmazenamento 
            from tb_leitura_pc WHERE IDCOMPUTADOR = ${req.params.id} 
                ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/processnumber/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT TOP(10) vlProcesso as result FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/uptime/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT TOP(10) tpAtividade as result FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/totalDiskRam/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`select top 1 vlmemoriaram, vlarmazenamento 
    from tb_computador
        where idcomputador =  ${req.params.id}`, res);
});

router.get('/pc/cpu/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT TOP(10) vlLeituraCpu as result FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/diskreadavarage/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT TOP(10) mdLeituraDisco as result FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/api/percentageTimeUp/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let apiId = req.params.id;
    let timeUp;
    let timeDown;

    global.conn.request()
        .query(_sqlStatementApiPercentage(apiId, true, 1))
        .then(result => {

            timeUp = parseInt(result.recordset[0].timeReturned);

            global.conn.request()
                .query(_sqlStatementApiPercentage(apiId, false, 1))
                .then(result => {

                    timeDown = parseInt(result.recordset[0].timeReturned);

                    let percentageUp = timeUp * 100 / (timeUp + timeDown);

                    res.json({ 'percentageUp': parseFloat(percentageUp.toFixed(2)), 'success': true });
                })
        })
        .catch(err => console.error(err));
});

router.get('/api/timeUp/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let apiId = req.params.id;

    global.conn.request()
        .query(_sqlStatementApiPercentage(apiId, true, 1))
        .then(result => {

            res.json({ 'timeUp': parseInt(result.recordset[0].timeReturned), 'success': true })
        })
        .catch(err => console.error(err));
});

router.get('/api/timeDowm/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let apiId = req.params.id;

    global.conn.request()
        .query(_sqlStatementApiPercentage(apiId, false, 1))
        .then(result => {

            res.json({ 'timeDown': parseInt(result.recordset[0].timeReturned), 'success': true })
        })
        .catch(err => console.error(err));
});

router.get('/api/numberTimesDown/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let apiId = req.params.id;
    let numberTimesDown = 0;
    let downIndication = false;

    global.conn.request()
        .query(_sqlStatementApiPercentage(apiId, undefined, undefined))
        .then(result => {
            result.recordset.forEach(result => {

                if (!result.active) {

                    numberTimesDown = downIndication ? numberTimesDown : numberTimesDown + 1
                    downIndication = true;
                }
                else {
                    downIndication = false;
                }

            })

            res.json({ 'numberTimesDown': numberTimesDown, 'success': true })
        })
        .catch(err => console.error(err));
});

//#region .: Utils

function _sqlStatementApiPercentage(apiId, isActive, rowCount) {
    return `
SELECT   ${rowCount == undefined || rowCount == 0 ? '' : `TOP ${rowCount}`} RANK () OVER (ORDER BY IDLEITURA) AS timeReturned
,        ATIVO AS active
FROM     TB_LEITURA_API 
WHERE    DTREGISTRO > DATEADD(d, DATEDIFF(d, 0, GETDATE()), -30)
AND      IDAPI = ${apiId}
${isActive == undefined ? '' : (isActive ? `AND ATIVO = 'True'` : `AND ATIVO = 'False'`)}
ORDER BY IDLEITURA DESC`
}

//#endregion

module.exports = router;