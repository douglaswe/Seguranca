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

app.get('/gettermo', (req, res) => {
    const sql = `SELECT * FROM termo t
                JOIN opcional o 
                ON o.opc_id_termo = t.ter_id
                WHERE t.ter_data = (SELECT MAX(ter_data) FROM termo);`;
    

    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results.rows);
    });
});



app.listen(3003, function () {
    console.log("Servidor rodando na porta 3003...");
});
