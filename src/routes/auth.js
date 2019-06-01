const express = require('express');
const jwt = require('jsonwebtoken');
const options = require('../config/token');
const hashCode = require('../config/hash');

const router = express.Router();

router.post('/', (req, res) => {
    //verifica se há algo no corpo da requisição
    if (!!req.body.email && !!req.body.senha) {
        console.log(!!req.body.email)
        //guarda numa variavel os dados de email e senha
        var email = req.body.email, senha = req.body.senha;
        //buscar o usuário no banco
        global.conn.request()
            .query(`SELECT * FROM TB_FUNCIONARIO WHERE NMEMAIL = '${email}'`)
            .then(user => {
                //verifica se trouxe alguma coisa
                if (user.recordset.length > 0) {
                    //se trouxe, verifica se a senha bate
                    console.log(senha, user.recordset[0].nmSenha, hashCode(senha));
                    if (user.recordset[0].nmSenha == hashCode(senha)) {
                        //se a senha bater, faz um token com o ID do usuário
                        let payload = { id: user.recordset[0].idFuncionario };
                        let token = jwt.sign(payload, options.secretOrKey);
                        //e responde, com status de sucesso, uma mensagem de OK e o token (que será usado no front)
                        user.recordset[0].token = token;
                        user.recordset[0].message = "Autenticado com Sucesso!";
                        console.log(user.recordset[0].idTipo)
                        switch(user.recordset[0].idTipo){
                            case 1:
                                console.log('entrou aqui')
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
                                    console.log('entrou aqui')
                                user.recordset[0].menu = [
                                    { 
                                      path: 'dev/', 
                                      titulo: "Index"
                                    }
                                ]   
                            break;
                            case 3:
                                    console.log('entrou aqui')
                                user.recordset[0].menu = 
                                [
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
                        //mensagem de senha incorreta com status de não autorizado
                        res.json({ "message": "senha incorreta" }).status(401);
                    }
                } else {
                    //mensagem de email nao encontrado com status de não autorizado
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