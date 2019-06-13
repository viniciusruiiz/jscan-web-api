const express = require('express');
const passport = require('passport');
const database = require('../data/database');

const router = express();

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT * FROM TB_COMPUTADOR WHERE IDCOMPUTADOR = ${req.params.id}`, res);
});

router.get('/getByEmployer/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    database.queryFromRoute(`SELECT * FROM TB_COMPUTADOR WHERE IDFUNCIONARIO = ${req.params.id}`, res);
});

module.exports = router;