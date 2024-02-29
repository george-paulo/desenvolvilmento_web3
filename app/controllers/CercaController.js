const bcrypt = require('bcrypt');
const utils = require('../lib/utils');
const Cerca = require('../lib/triacontagono/Cerca');

class CercaController {
    constructor(cercaDao) {
        this.cercaDao = cercaDao;
    }

    index(req, res) {
        utils.renderizarEjs(res, './views/index.ejs');
    }

    area(req, res) {
        let corpoTexto = '';
        req.on('data', function (pedaco) {
            corpoTexto += pedaco;
        });
        req.on('end', () => {
            let propriedades = corpoTexto.split('&');
            let query = {};
            for (let propriedade of propriedades) {
                let [variavel, valor] = propriedade.split('=');
                query[variavel] = valor;
            }
            let cerca = new Cerca();
            cerca.nome = query.nome;
            cerca.lado = parseFloat(query.lado);

            utils.renderizarEjs(res, './views/areaCerca.ejs', cerca);
        });
    }

      
    async listar(req, res) {
        try {
            let cercas = await this.cercaDao.listar();

            let dados = cercas.map(cerca => {
                return {
                    id: cerca.id, 
                    nome: cerca.nome,
                    lado: cerca.lado,
                    area: cerca.calcularArea ? cerca.calcularArea() : null
                };
            });

            console.log('Dados a serem enviados como JSON:', dados);

            utils.renderizarJSON(res, dados);
        } catch (error) {
            console.error('Erro ao listar cercas:', error);
            utils.renderizarJSON(res, { mensagem: error.message }, 500);
        }
    }

    async inserir(req, res) {
        let cerca = await this.getCercaFromRequest(req);
        try {
            this.cercaDao.inserir(cerca);
            utils.renderizarJSON(res, {
                cerca: {
                    ...cerca,
                    area: cerca.calcularArea(), 
                },
                mensagem: 'Cerca Cadastrada Com Sucesso'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }

    async alterar(req, res) {
        let cerca = await this.getCercaFromRequest(req);
        let [url, queryString] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        try {
            this.cercaDao.alterar(id, cerca);
            utils.renderizarJSON(res, {
                mensagem: 'Cerca alterada Com Sucesso'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }

    apagar(req, res) {
        let [url, queryString] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        this.cercaDao.apagar(id);
        utils.renderizarJSON(res, {
            mensagem: 'Cerca Apagada Com Sucesso',
            id: id
        });
    }

    async getCercaFromRequest(req) {
        let corpo = await utils.getCorpo(req);
        let cerca = new Cerca(
            corpo.nome,
            parseFloat(corpo.lado),
            corpo.papel
        );
        return cerca;
    }
}

module.exports = CercaController;