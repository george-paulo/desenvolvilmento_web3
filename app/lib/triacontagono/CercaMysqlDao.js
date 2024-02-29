const bcrypt = require('bcrypt');
const Cerca = require('./Cerca');

class CercaMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }

    listar() {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT * FROM cercas;', function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let cercas = linhas.map(linha => {
                    let { id, nome, lado } = linha;
                    return new Cerca(nome, lado, id);
                })
                resolve(cercas);
            });
        });
    }

    inserir(cerca) {
        this.validar(cerca);

        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO cercas (nome, lado) VALUES (?, ?);';
            console.log({ sql }, cerca);
            this.pool.query(sql, [cerca.nome, cerca.lado], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.insertId);
            });
        });
    }

    alterar(id, cerca) {
        this.validar(cerca);
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE cercas SET nome=?, lado=? WHERE id=?;';
            this.pool.query(sql, [cerca.nome, cerca.lado, id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.alterId);
            });
        });
    }

    apagar(id) {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM cercas WHERE id=?;';
            this.pool.query(sql, id, function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.deleteId);
            });
        });
    }

    validar(cerca) {
        if (cerca.nome == '') {
            throw new Error('Mensagem nome em branco');
        }
        if (cerca.lado < 0) {
            throw new Error('Tamanho invalido');
        }
    }
}

module.exports = CercaMysqlDao;
