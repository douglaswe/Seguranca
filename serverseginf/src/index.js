const express = require('express');
const app = express();
const mysql = require('mysql2');

app.get('/', function (req, res) {
    res.send('Raiz');
});

//alterar
const db = mysql.createConnection({
    host: 'localhost',    
    user: 'root',         
    password: '',         
    database: 'seginf'  
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
      res.json(results);
    });
});

app.get('/gettermo', (req, res) => {
    const sql = 'SELECT * FROM termo WHERE ter_data = (SELECT MAX(ter_data) FROM termo);';
    
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
});




app.listen(3003, function () {
    console.log("Servidor rodando na porta 3003...");
});
