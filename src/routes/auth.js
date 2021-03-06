const express = require('express');
const jwt = require('jsonwebtoken');
const options = require('../config/token');
const hashCode = require('../config/hash');

const router = express.Router();

router.post('/', (req, res) => {
    if (!!req.body.email && !!req.body.senha) {
        var email = req.body.email, senha = req.body.senha;
        global.conn.request()
            .query(`
   SELECT F.IDFUNCIONARIO AS id
,         F.NMFUNCIONARIO AS name
,         F.NMSENHA AS password
,         F.IDEMPRESA AS idCompany
,         F.IDGESTOR AS idManager
,         F.IDTIPO AS type
,         F.NMEMAIL AS email
,         F.NRTELEFONE AS phone
,         C.IDCOMPUTADOR AS idPc
     FROM TB_FUNCIONARIO F
LEFT JOIN TB_COMPUTADOR  C
       ON F.IDFUNCIONARIO = C.IDFUNCIONARIO
    WHERE F.NMEMAIL = '${email}'`)
            .then(user => {
                if (user.recordset.length > 0) {
                    console.log(senha)
                    if (user.recordset[0].password == hashCode(senha)) {
                        let payload = { id: user.recordset[0].id };
                        let token = jwt.sign(payload, options.secretOrKey);
                        user.recordset[0].token = token;
                        user.recordset[0].message = "Autenticado com Sucesso!";
                        res.json(user.recordset[0]);
                    } else {
                        res.json({ "message": "senha incorreta" }).status(401);
                    }
                } else {
                    res.json({ "message": 'usuario não encontrado' }).status(401);
                }
            })
            .catch(err => console.error(err));
    }
    else {
        res.json({ "message": 'preencha todos os campos!' }).status(401);
    }

});

module.exports = router;