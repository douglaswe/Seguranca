const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Raiz');
});

const db = new Pool({
    connectionString: "postgres://aygmbahg:GCwxJ9kJTABAiFxeuK520igmfHIsTgnF@kala.db.elephantsql.com/aygmbahg"
});

db.connect((err) => {
    if (err) {
        throw err;
        console.log(err)
    }
    console.log('Connected to the database');
});

app.get('/getusers', (req, res) => {
    const sql = 'SELECT * FROM usuario';
    
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results.rows);
    });
});

app.get('/gettermo', async (req, res) => {
    try{
        const termo = await db.query(`SELECT * FROM termo WHERE ter_data = (SELECT MAX(ter_data) FROM termo);`);
        const id_termo = termo.rows[0].ter_id
        const opc = await db.query(`SELECT opc_id, opc_texto FROM opcional WHERE opc_id_termo = ${id_termo};`);
        const resultado = {
            ter_id: termo.rows[0].ter_id,
            ter_versao: termo.rows[0].ter_versao,
            ter_texto: termo.rows[0].ter_texto,
            ter_data: termo.rows[0].ter_data,
            ter_opcionais: opc.rows
        }
        if(termo.rowCount == 0){
            res.status(404).json({ message: 'dados não encontrados' });
        }else{
            res.status(200).json(resultado);
        }
    }catch (error) {
        res.status(500).json({ error: error.message });
    }   
});

app.post('/cadastrar', async (req,res) => {
    try {
        const { nome , email , telefone , senha, termo_id} = req.body;
        const keys = Object.keys(req.body);
        const opcAceitados = new Array;

        const testeEmail = await db.query(`SELECT * FROM usuario WHERE usu_email = '${email}'`);

        if(testeEmail.rowCount > 0){
            res.status(500).json({ message: "E-mail já cadastrado" });
        }else{
            await db.query('INSERT INTO usuario(usu_nome, usu_email, usu_telefone, usu_senha) VALUES($1, $2, $3, $4)',
            [nome, email, telefone, senha]);

            const queryUserId = await db.query(`SELECT usu_id FROM usuario WHERE usu_email = '${email}' `);
            const userId = Number(queryUserId.rows[0].usu_id);

            await db.query(`INSERT INTO aceite_termo(ace_id_usuario, ace_id_termo, ace_aceitado)
                VALUES(${userId}, ${termo_id}, TRUE)`);

            for(let i = 0; i< keys.length; i++){
                if(keys[i].startsWith('opc')){
                    const opc_id = keys[i].split(' ')[1];
                    opcAceitados.push(Number(opc_id))
                }
            }
            for(let i = 0; i< opcAceitados.length; i++){
                db.query(`INSERT INTO aceite_opc(aop_id_usuario, aop_id_termo, aop_id_opcional, aop_aceitado)
                    VALUES(${userId}, ${termo_id}, ${opcAceitados[i]}, TRUE)`);
            }
            res.status(201).json({ message: 'usuário criado com sucesso' });
        }
        
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});
  

app.listen(3003, function () {
    console.log("Servidor rodando na porta 3003...");
});
