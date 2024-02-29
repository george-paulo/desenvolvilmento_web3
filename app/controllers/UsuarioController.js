const utils = require('../lib/utils')
const Usuario = require('./../lib/triacontagono/Usuario');

class UsuariosController {
    constructor(usuarioDao) {
        this.usuarioDao = usuarioDao;
    }

    async listar(req, res) {
        let usuarios = await this.usuarioDao.listar();

        let dados = usuarios.map(usuario => {
            return {
                ...usuario
            };
        })

        utils.renderizarJSON(res, dados);
    }
    
    async inserir(req, res) {
        let usuario = await this.getUsuarioDaRequisicao(req);
        try {
            usuario.id = await this.usuarioDao.inserir(usuario);
            utils.renderizarJSON(res, {
                usuario: {
                    ...usuario
                },
                mensagem: 'Usuário cadastrado com sucesso.'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }

    async alterar(req, res) {
        let usuario = await this.getUsuarioDaRequisicao(req);
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        try {
            this.usuarioDao.alterar(id, usuario);
            utils.renderizarJSON(res, {
                mensagem: 'Usuário alterado com sucesso.'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }
    
    apagar(req, res) {
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        this.usuariosDao.apagar(id);
        utils.renderizarJSON(res, {
            mensagem: 'Usuário apagado com sucesso.',
            id: id
        });
    }

    async getUsuarioDaRequisicao(req) {
        let corpo = await utils.getCorpo(req);
        let usuario = new Usuario(
            corpo.nome,
            corpo.senha,
            corpo.papel
        );
        return usuario;
    }
}

module.exports = UsuariosController;