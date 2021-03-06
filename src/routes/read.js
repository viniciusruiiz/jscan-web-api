const express = require('express');
const passport = require('passport');
const database = require('../data/database');

const router = express();

router.get('/pc/cpu/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT TOP(7) round(vlLeituraCpu, 2) AS percentageCpu, CONVERT(VARCHAR(8), dtregistro,108) as readDate FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/lastReadTime/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT TOP(1) CONVERT(VARCHAR(8), dtregistro,108) as readDate FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/ram/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`select top(10) vlLeituraMemoria
        FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/disk/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`select top 1 
        vlleituraarmazenamento 
            from tb_leitura_pc WHERE IDCOMPUTADOR = ${req.params.id} 
                ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/processnumber/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT top 1 vlProcesso as processNumber FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/uptime/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT TOP 1 tpAtividade as upTime FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/diskreadavarage/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT TOP(7) mdLeituraDisco as diskReadAvarage, CONVERT(VARCHAR(8), dtregistro,108) as readDate FROM TB_LEITURA_PC WHERE IDCOMPUTADOR = ${req.params.id} ORDER BY IDLEITURA DESC`, res);
});

router.get('/pc/availableStorage/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let pcId = req.params.id;

    global.conn.request()
        .query(`SELECT TOP 1 round((DATA.vlleituraarmazenamento / 1048576 / 1024), 2) as vlleituraarmazenamento, PC.vlarmazenamento
                FROM TB_COMPUTADOR       PC
                INNER JOIN TB_LEITURA_PC DATA 
                ON PC.IDCOMPUTADOR = DATA.IDCOMPUTADOR
                WHERE PC.IDCOMPUTADOR = ${pcId}
                ORDER BY DATA.IDLEITURA DESC`)
        .then(result => {

            console.log(result.recordset)

            let total = Math.round(result.recordset[0].vlarmazenamento);
            let available = Math.round(result.recordset[0].vlleituraarmazenamento);
            let percentageAvailable = (available * 100) / total;

            console.log(percentageAvailable);

            res.json({
                "percentageAvailableStorage": parseFloat(percentageAvailable.toFixed(2)),
                "available": available,
                "total": total,
            })
        })
});

router.get('/pc/memoryPercentageAvailable/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let pcId = req.params.id;
    let retVal = [];

    global.conn.request()
        .query(`SELECT TOP 7 round((DATA.vlLeituraMemoria / 1048576), 2) as vlLeituraMemoria, PC.vlMemoriaRam, CONVERT(VARCHAR(8), DATA.dtregistro,108) as readDate
                FROM TB_COMPUTADOR       PC
                INNER JOIN TB_LEITURA_PC DATA 
                ON PC.IDCOMPUTADOR = DATA.IDCOMPUTADOR
                WHERE PC.IDCOMPUTADOR = ${pcId}
                ORDER BY DATA.IDLEITURA DESC`)
        .then(result => {

            result.recordset.forEach(line => {
                let total = parseFloat(line.vlMemoriaRam);
                let available = parseFloat(line.vlLeituraMemoria);
                let percentageAvailable = (available * 100) / total;

                retVal.push({
                    "percentageMemoryAvailable": parseFloat(percentageAvailable.toFixed(2)),
                    "readDate": line.readDate
                })
            })

            res.json(retVal);

        }).catch(err => console.log(err));
});

router.get('/api/percentageTimeUp/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let apiId = req.params.id;
    let timeUp;
    let timeDown;

    global.conn.request()
        .query(_sqlStatementApiPercentage(apiId, true, 1))
        .then(result => {

            timeUp = result.recordset[0] ? parseInt(result.recordset[0].timeReturned) : 0;

            global.conn.request()
                .query(_sqlStatementApiPercentage(apiId, false, 1))
                .then(result => {

                    timeDown = result.recordset[0] ? parseInt(result.recordset[0].timeReturned) : 0;

                    let percentageUp = timeUp * 100 / (timeUp + timeDown);

                    res.json({
                        'percentageUp': parseFloat(percentageUp.toFixed(2)),
                        'timeUp': timeUp,
                        'timeDown': timeDown,
                        'success': true,
                    });
                }).catch(err => console.error(err));
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

    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')

    global.conn.request()
        .query(_sqlStatementNumberTimesDown(apiId, 1, -30))
        .then(result => {
            result.recordset.forEach(result => {

                if (!result.active) {
                    if (!downIndication) {
                        numberTimesDown += 1
                        downIndication = true;
                    }
                }
                else {
                    downIndication = false;
                }

            })

            res.json({ 'numberTimesDown': numberTimesDown, 'success': true })
        })
        .catch(err => console.error(err));
});

router.get('/api/numberTimesDownLastMonth/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let apiId = req.params.id;
    let numberTimesDown = 0;
    let downIndication = false;

    global.conn.request()
        .query(_sqlStatementNumberTimesDown(apiId, -31, -60))
        .then(result => {
            result.recordset.forEach(result => {

                if (!result.active) {
                    if (!downIndication) {
                        numberTimesDown += 1
                        downIndication = true;
                    }
                }
                else {
                    downIndication = false;
                }

            })

            res.json({ 'numberTimesDown': numberTimesDown, 'success': true })
        })
        .catch(err => console.error(err));
});

router.get('/api/numberTimesDownLastMonth2/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let apiId = req.params.id;
    let numberTimesDown = 0;
    let downIndication = false;

    global.conn.request()
        .query(_sqlStatementNumberTimesDown(apiId, -61, -90))
        .then(result => {
            result.recordset.forEach(result => {

                if (!result.active) {
                    if (!downIndication) {
                        numberTimesDown += 1
                        downIndication = true;
                    }
                }
                else {
                    downIndication = false;
                }

            })

            res.json({ 'numberTimesDown': numberTimesDown, 'success': true })
        })
        .catch(err => console.error(err));
});

router.get('/api/numberTimesDownLastMonth3/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let apiId = req.params.id;
    let numberTimesDown = 0;
    let downIndication = false;

    global.conn.request()
        .query(_sqlStatementNumberTimesDown(apiId, -91, -120))
        .then(result => {
            result.recordset.forEach(result => {

                if (!result.active) {
                    if (!downIndication) {
                        numberTimesDown += 1
                        downIndication = true;
                    }
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
WHERE    IDAPI = ${apiId}
${isActive == undefined ? '' : (isActive ? `AND ATIVO = 'True'` : `AND ATIVO = 'False'`)}
ORDER BY IDLEITURA DESC`
}

function _sqlStatementNumberTimesDown(apiId, minDate, maxDate) {
    var query =  `
  SELECT RANK () OVER (ORDER BY IDLEITURA) AS timeReturned
,        ATIVO AS active
    FROM TB_LEITURA_API
   WHERE IDAPI=${apiId}
     AND DTREGISTRO between DATEADD(d, DATEDIFF(d, 0, GETDATE()), ${maxDate}) and  DATEADD(d, DATEDIFF(d, 0, GETDATE()), ${minDate})
ORDER BY IDLEITURA DESC`

console.log(query)

return query;
}

//#endregion

module.exports = router;