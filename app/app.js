const express = require('express');
const bodyParser = require('body-parser');
const CercaController = require('./controllers/CercaController');
const AutorController = require('./controllers/AutorController');
const EstaticoController = require('./controllers/EstaticoController');
const AuthController = require('./controllers/AuthController');
const CercaMysqlDao = require('./lib/triacontagono/CercaMysqlDao');
const UsuariosMysqlDao = require('./lib/triacontagono/UsuariosMysqlDao');
const UsuarioController = require('./controllers/UsuarioController');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'bd',
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE
});

const cercaDao = new CercaMysqlDao(pool);
const usuarioDao = new UsuariosMysqlDao(pool);
const cercaController = new CercaController(cercaDao);
const usuarioController = new UsuarioController(usuarioDao);

const autorController = new AutorController();
const estaticoController = new EstaticoController();
const authController = new AuthController();

app.use((req, res) => {
    let [url] = req.url.split('?');
    let urlList = url.split('/');
    url = urlList[1];
    let metodo = req.method;

    if (url === 'index') {
        cercaController.index(req, res);
    } else if (url === 'triacontagono' && metodo === 'POST') {
        cercaController.inserir(req, res);
    } else if (url === 'triacontagono' && metodo === 'GET') {
        cercaController.index(req, res);
    } else if (url === 'triacontagono' && metodo === 'PUT') {
        cercaController.alterar(req, res);
    } else if (url === 'triacontagono' && metodo === 'DELETE') {
        cercaController.apagar(req, res);
    } else if (url === 'autor') {
        autorController.index(req, res);
    } else if (url === 'usuarios' && metodo === 'POST') {
        usuarioController.inserir(req, res);
    } else if (url === 'usuarios' && metodo === 'PUT') {
        authController.autorizar(req, res, () => {
            usuarioController.alterar(req, res);
        }, ['admin', 'geral']);
    } else if (url === 'usuarios' && metodo === 'DELETE') {
        authController.autorizar(req, res, () => {
            usuarioController.apagar(req, res);
        }, ['admin']);
    } else if (url === 'usuarios' && metodo === 'GET') {
        usuarioController.listar(req, res);
    } else if (url === 'login' && metodo === 'GET') {
        authController.index(req, res);
    } else if (url === 'logar' && metodo === 'POST') {
        authController.logar(req, res);
    } else {
        estaticoController.procurar(req, res);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
