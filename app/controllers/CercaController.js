const getCerca = require('../models/Cerca');
const Cerca = require('../lib/Cerca');

class CercaController {
    constructor() {
        this.Cerca = null;
        getCerca().then((model) => {
          this.Cerca = model;
          console.log('Modelo Cerca carregado:', this.Cerca);
        });
    }

    async create(req, res) {
        const { nome, lado } = req.body;
        const cerca = await this.Cerca.create({ nome, lado });


        const cercaObj = new Cerca(nome, lado);
        const area = cercaObj.area();


        res.render('resposta', { area });
    }

    async list(req, res) {
        console.log('Rota /cercas chamada');
        const cercas = await this.Cerca.findAll();


        cercas.forEach(cerca => {
            const cercaObj = new Cerca(cerca.nome, cerca.lado);
            cerca.area = cercaObj.area();
        });

        console.log('Cercas recuperadas do banco de dados:', cercas);
        res.render('cercas', { cercas });
    }

    async editar(req, res) {
        const { id } = req.params;
        const cerca = await this.Cerca.findOne({ where: { id } });
        if (!cerca) {
            return res.redirect('/cercas');
        }
        res.render('editar', { cerca });
    }

    async update(req, res) {
        console.log('Update chamado o metódo update');
        const { id, nome, lado } = req.body;
        console.log('Parameters:', id, nome, lado);
        await this.Cerca.update({ nome, lado }, { where: { id } });
        res.redirect('/cercas');
    }

    async delete(req, res) {
        const { id } = req.params;
        await this.Cerca.destroy({ where: { id } });
        req.session.messages = { success: 'Cerca excluída com sucesso.' };
        res.redirect('/cercas');
    }

    async getById(req, res) {
        const { id } = req.params;
        const cerca = await this.Cerca.findOne({ where: { id } });
        res.render('cerca', { cerca });
    }
}

module.exports = CercaController;