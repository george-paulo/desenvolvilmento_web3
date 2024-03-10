const SobreController = require('../controllers/SobreController');
const express = require('express');
const router = express.Router();
const Cerca = require('../lib/Cerca');
const CercaController = require('../controllers/CercaController');
const initializeAdminController = require('../controllers/AdminController');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const sobreController = new SobreController();
const cercaController = new CercaController();

router.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(`Cabeçalho de Autorização: ${authHeader}`);
    next();
});

initializeAdminController().then(adminController => {
    router.get('/cercas/editar/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
        const { id } = req.params;
        cercaController.editar(req, res);
    });

    router.post('/cercas', passport.authenticate('jwt', { session: false }), (req, res) => cercaController.create(req, res));
    router.get('/cercas', passport.authenticate('jwt', { session: false }), (req, res) => cercaController.list(req, res));
    router.get('/admin', passport.authenticate('jwt', { session: false }), (req, res) => adminController.list(req, res));
    router.get('/admin/create', passport.authenticate('jwt', { session: false }), (req, res) => res.render('criar_admin'));
    router.get('/admin/login', (req, res) => adminController.showLoginForm(req, res));
    router.post('/admin/login', (req, res) => {
        adminController.login(req, res)
            .then(user => {
                if (!user) {
                    // Não envie uma resposta aqui se você já está enviando uma dentro de adminController.login
                } else {
                    const token = jwt.sign({ id: user.id }, process.env.SEGREDO_JWT);
                    // Não envie uma resposta aqui se você já está enviando uma dentro de adminController.login
                }
            })
            .catch(err => {
                console.error(err);
                // Não envie uma resposta aqui se você já está enviando uma dentro de adminController.login
            });
    });

    router.get('/admins', passport.authenticate('jwt', { session: false }), (req, res) => adminController.list(req, res));
    router.put('/cercas/:id', passport.authenticate('jwt', { session: false }), (req, res) => cercaController.update(req, res));
    router.delete('/cercas/:id', passport.authenticate('jwt', { session: false }), (req, res) => cercaController.delete(req, res));
    router.get('/cercas/:id', passport.authenticate('jwt', { session: false }), (req, res) => cercaController.getById(req, res));
    router.get('/', (req, res) => res.render('index'));
    router.get('/index', (req, res) => res.redirect('/'));
    router.get('/sobre', (req, res) => sobreController.index(req, res));
    router.get('/resposta', (req, res) => {
        const { nome, lado, id } = req.query;
        const cerca = new Cerca(nome, lado, id);
        res.render('resposta', { area: cerca.area() });
    });
}).catch(console.error);

module.exports = router;