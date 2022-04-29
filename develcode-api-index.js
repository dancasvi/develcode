var express = require('express')
  , app = express();
 
const cors = require('cors');
var mysql      = require('mysql');
var bodyParser = require('body-parser');
 
path = require('path');
app.use(express.static('./dist/portfolio-definitivo'));
 
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/dist/portfolio-definitivo/index.html'));
});
 
app.listen(21075);

var connection = mysql.createConnection({
	host     : 'mysql.dancasvi.com.br',
	user     : 'dancasvi',
	password : 'Meyryelly123',
	database : 'dancasvi',
        insecureAuth : true
});

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected with mysql database...')
});
 
app.use(cors({
    exposedHeaders:
        [
            'status',
            'x-access-token',
            'statusCreateList',
            'messageStatusCreateList'
        ]
}));
 
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.post('/develcode/create', function (req, res) {
        var codigo = req.body.codigo;
	var nome = req.body.nome;
	var dtNascimento = req.body.dtNascimento;
	var foto = req.body.foto;
 
	var query = 'INSERT INTO `CadastroDevelcode`(`codigo`, `nome`, `dtNascimento`, `foto`) VALUES (?, ?, ?, ?)'
	
    connection.query(query, [codigo, nome, dtNascimento, foto], function (error, results, fields) {
        if(error) {
            const errorObj = {status: 400, msg: 'Um erro aconteceu: ' + error};
            res.end(JSON.stringify(errorObj));
        } else {
            if(results.affectedRows == 1){
                const saved = {status: 1, msg: 'Usuario registrado.', id: results.insertId};
                res.end(JSON.stringify(saved));
            }else{
                const notSaved = {status: 0, msg: 'Usuario não registrado.'};
                res.end(JSON.stringify(notSaved));
            }
        }
    });
});

app.get('/develcode/read', function (req, res) {
    connection.query('SELECT * FROM `CadastroDevelcode` order by codigo asc', function (error, results, fields) {
        if(error) {
            const errorObj = {status: 400, msg: 'Ocorreu um erro: ' + error};
            res.end(JSON.stringify(errorObj));
        }else{
            if(results.length != 0) {
                const found = {status: 1, msg: 'Usuarios encontrados!', data: results};
                res.end(JSON.stringify(found));
            }else{
                const notFound = {status: 0, msg: 'Nenhum usuario encontrado.'};
                res.end(JSON.stringify(notFound));
            }
        }
    });
});

app.get('/develcode/:codigo', function (req, res) {
    var codigo = req.params.codigo;
    var query = "SELECT * FROM `CadastroDevelcode` WHERE codigo = ?";
   
    connection.query(query, [codigo], function (error, results, fields) {
        if(error) {
            const errorObj = {status: 400, msg: 'Ocorreu um erro: ' + error};
            res.end(JSON.stringify(errorObj));
        }else{
            if(results.length != 0) {
                const found = {status: 1, msg: 'Usuario encontrado!', data: results};
                res.end(JSON.stringify(found));
            }else{
                const notFound = {status: 0, msg: 'Usuario não encontrado'};
                res.end(JSON.stringify(notFound));
            }
        }
    });
});

app.put('/develcode/update', function (req, res) {
	var codigo = req.body.codigo;
	var nome = req.body.nome;
	var dtNascimento = req.body.dtNascimento;
	var foto = req.body.foto;
 
	var query = 'UPDATE `CadastroDevelcode` SET `nome`= ?,`dtNascimento`= ? WHERE `codigo` = ?';
	
    connection.query(query, [nome, dtNascimento, codigo], function (error, results, fields) {
        if(error) {
            const errorObj = {status: 400, msg: 'Um erro aconteceu: ' + error};
            res.end(JSON.stringify(errorObj));
        } else {
            if(results.affectedRows == 1){
                const saved = {status: 1, msg: 'Usuario atualizado.', id: results.insertId};
                res.end(JSON.stringify(saved));
            }else{
                const notSaved = {status: 0, msg: 'Usuario não atualizado.'};
                res.end(JSON.stringify(notSaved));
            }
        }
    });
});

app.delete('/develcode/remove/:id', function (req, res) {
	var id = req.params.id;
 
	var query = 'DELETE FROM `CadastroDevelcode` WHERE codigo = ?'
	
    connection.query(query, [id], function (error, results, fields) {
        if(error) {
            const errorObj = {status: 400, msg: 'Um erro aconteceu: ' + error};
            res.end(JSON.stringify(errorObj));
        } else {
            if(results.affectedRows == 1){
                const saved = {status: 1, msg: 'Usuario removido.', id: results.insertId};
                res.end(JSON.stringify(saved));
            }else{
                const notSaved = {status: 0, msg: 'Usuario não removido.'};
                res.end(JSON.stringify(notSaved));
            }
        }
    });
});