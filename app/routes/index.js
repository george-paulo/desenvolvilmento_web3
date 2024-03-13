const SobreController = require('../controllers/SobreController');
const express = require('express');
const router = express.Router();
const Cerca = require('../lib/Cerca');
//consertado
const sobreController = new SobreController();

router.get('/', (req, res) => res.render('index'));
router.get('/index', (req, res) => res.redirect('/'));
router.get('/sobre', (req, res) => sobreController.index(req, res));
router.get('/resposta', (req, res) => {
    const { nome, lado, id } = req.query;
    const cerca = new Cerca(nome, lado, id);
    res.render('resposta', { area: cerca.area() });
});

module.exports = router;