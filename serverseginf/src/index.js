const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "chave_secreta";

app.get('/', function (req, res) {
    res.send('Raiz');
});

const db = new Pool({
    connectionString: "postgres://aygmbahg:GCwxJ9kJTABAiFxeuK520igmfHIsTgnF@kala.db.elephantsql.com/aygmbahg"
});

const db2 = new Pool({
    connectionString: "postgres://trncmvpn:cF34bEJfRN6Q8PwnJ17wQhnRlSFLoTHg@mahmud.db.elephantsql.com/trncmvpn"
});

db.connect((err) => {
    if (err) {
        throw err;
        console.log(err)
    }
    console.log('Conectado ao banco de dados principal');
});

db2.connect((err) => {
    if (err) {
        throw err;
        console.log(err)
    }
    console.log('Conectado ao banco de dados auxiliar');
});

app.get('/getusers', (req, res) => {
    const sql = 'SELECT * FROM usuario';

    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results.rows);
    });
});

app.get('/gettermo', async (req, res) => {
    try {
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
        if (termo.rowCount == 0) {
            res.status(404).json({ message: 'dados não encontrados' });
        } else {
            res.status(200).json(resultado);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/cadastrar', async (req, res) => {
    try {
        const { nome, email, telefone, senha, termo_id } = req.body;
        const keys = Object.keys(req.body);
        const opcAceitados = new Array;

        const testeEmail = await db.query(`SELECT * FROM usuario WHERE usu_email = '${email}'`);

        if (testeEmail.rowCount > 0) {
            res.status(500).json({ message: "E-mail já cadastrado" });
        } else {
            await db.query('INSERT INTO usuario(usu_nome, usu_email, usu_telefone, usu_senha) VALUES($1, $2, $3, $4)',
                [nome, email, telefone, senha]);

            const queryUserId = await db.query(`SELECT usu_id FROM usuario WHERE usu_email = '${email}' `);
            const userId = Number(queryUserId.rows[0].usu_id);

            await db.query(`INSERT INTO aceite_termo(ace_id_usuario, ace_id_termo, ace_aceitado)
                VALUES(${userId}, ${termo_id}, TRUE)`);

            for (let i = 0; i < keys.length; i++) {
                if (keys[i].startsWith('opc')) {
                    const opc_id = keys[i].split(' ')[1];
                    opcAceitados.push(Number(opc_id))
                }
            }
            for (let i = 0; i < opcAceitados.length; i++) {
                db.query(`INSERT INTO aceite_opc(aop_id_usuario, aop_id_termo, aop_id_opcional, aop_aceitado)
                    VALUES(${userId}, ${termo_id}, ${opcAceitados[i]}, TRUE)`);
            }
            res.status(201).json({ message: 'usuário criado com sucesso' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {

    try {
        const { usu_email, usu_senha } = req.body;
        const queryEmail = await db.query(`SELECT usu_id FROM usuario WHERE usu_email = '${usu_email}';`);
        const deletados = await db2.query('SELECT id FROM id_deletados;');
        function testar_deletado(id){
            for(let i = 0 ; i< deletados.rowCount; i++){
                if(id == deletados.rows[i].id){
                    return 1;
                }
            }
            return 0;
        }

        if (queryEmail.rowCount == 0) {
            res.status(500).json({ message: "E-mail não encontrado" });
        } else if(testar_deletado(queryEmail.rows[0].usu_id) == 1) {
            await db.query(`UPDATE usuario SET usu_nome = 'deletado', usu_email = 'deletado', usu_telefone = 'deletado', usu_senha = 'deletado' WHERE usu_id = ${queryEmail.rows[0].usu_id}`);
            res.status(500).json({ message: "E-mail não encontrado." });
        } else {
            const querySenha = await db.query(`SELECT usu_senha FROM usuario WHERE usu_email = '${usu_email}';`);
            if (usu_senha != querySenha.rows[0].usu_senha) {
                res.status(500).json({ message: "Senha incorreta" });
            } else {
                const userId = queryEmail.rows[0].usu_id;
                const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });
                res.status(201).json({ message: 'Login realizado com sucesso!', token });
            }
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/updateuser/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, senha } = req.body;

    try {

        const query = `
            UPDATE usuario
            SET usu_nome = $1, usu_email = $2, usu_telefone = $3, usu_senha = $4
            WHERE usu_id = $5
            RETURNING *
        `;

        const values = [nome, email, telefone, senha, id];

        const result = await db.query(query, values);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
});

app.delete('/deleteuser/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(`UPDATE usuario SET usu_nome = 'deletado', usu_email = 'deletado', usu_telefone = 'deletado', usu_senha = 'deletado' WHERE usu_id = $1`, [id]);
        const exc = await db2.query(`INSERT INTO id_deletados(id) VALUES (${id});`);
        if (result.rowCount > 0 && exc.rowCount > 0) {
            res.status(200).json({ message: 'Usuário deletado com sucesso!' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/getuser', async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;
        const result = await db.query('SELECT * FROM usuario WHERE usu_id = $1', [userId]);
        if (result.rowCount > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
});

app.listen(3003, function () {
    console.log("Servidor rodando na porta 3003...");
});
