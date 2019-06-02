const express = require('express');
const jwt = require('jsonwebtoken');
const options = require('../config/token');
const hashCode = require('../config/hash');

const router = express.Router();

router.post('/', (req, res) => {
    if (!!req.body.email && !!req.body.senha) {
        console.log(!!req.body.email)
        var email = req.body.email, senha = req.body.senha;
        global.conn.request()
            .query(`
   SELECT F.IDFUNCIONARIO
,         F.NMFUNCIONARIO
,         F.NMEMAIL
,         F.NMSENHA
,         F.IDEMPRESA
,         F.IDGESTOR
,         F.IDTIPO
,         C.IDCOMPUTADOR
     FROM TB_FUNCIONARIO F
LEFT JOIN TB_COMPUTADOR  C
       ON F.IDFUNCIONARIO = C.IDFUNCIONARIO
    WHERE F.NMEMAIL = '${email}'`)
            .then(user => {
                if (user.recordset.length > 0) {
                    console.log(senha, user.recordset[0].nmSenha, hashCode(senha));
                    if (user.recordset[0].nmSenha == hashCode(senha)) {
                        let payload = { id: user.recordset[0].idFuncionario };
                        let token = jwt.sign(payload, options.secretOrKey);
                        user.recordset[0].token = token;
                        user.recordset[0].message = "Autenticado com Sucesso!";
                        switch (user.recordset[0].idTipo) {
                            case 1:
                                user.recordset[0].menu = [
                                    {
                                        path: 'gestor/',
                                        titulo: "Index"
                                    },
                                    {
                                        path: 'cadastro-funcionario',
                                        titulo: "Cadastrar Funcionario"
                                    },
                                    {
                                        path: 'gestor/cadastro-api',
                                        titulo: "Cadastrar Apis"
                                    }
                                ]
                                break;
                            case 2:
                                user.recordset[0].menu = [
                                    {
                                        path: 'dev/',
                                        titulo: "Index"
                                    }
                                ]
                                break;
                            case 3:
                                user.recordset[0].menu = [
                                    {
                                        path: 'empresa/lista-funcionarios',
                                        titulo: "Lista de Funcionarios"
                                    },
                                    {
                                        path: 'cadastro-funcionario',
                                        titulo: "Cadastrar Funcionario"
                                    },
                                    {
                                        path: 'empresa/',
                                        titulo: "Index"
                                    },
                                ]
                                break;
                        }
                        console.log(user.recordset[0]);
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