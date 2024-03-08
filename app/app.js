const express = require('express');
const app = express();
const path = require('path');
const router = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}] ${req.method} to ${req.url}`);
    next();
});

app.use('/', router);

app.use((req, res, next) => {
    res.status(404).send('Página não encontrada');
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));