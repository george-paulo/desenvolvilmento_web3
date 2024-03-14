const bcrypt = require('bcrypt');
const getAdmin = require('../models/Admin');
const getSequelize = require('../lib/database');
const { generateToken } = require('../utils/jwt');

class AdminController {
    constructor() {
        this.Admin = null;
        getSequelize().then((sequelize) => {
            getAdmin(sequelize).then((model) => {
                this.Admin = model;
            });
        });
    }

    async login(req, res) {
        const { nome, senha } = req.body;

        if (!nome || !senha) {
            return res.status(400).json({ error: 'Nome de usuário e senha são necessários' });
        }

        try {
            const admin = await this.Admin.findOne({ where: { nome } });
            if (!admin || !bcrypt.compareSync(senha, admin.senha)) {
                return res.status(401).json({ error: 'Usuário ou senha inválidos' });
            }

            const token = generateToken({ id: admin.id, nome: admin.nome });
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/admin');
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    showLoginForm(req, res) {
        res.render('login', { messages: req.flash() });
    }

    async create(req, res) {
        const { nome, senha } = req.body;
        const hashedPassword = bcrypt.hashSync(senha, 10);
        const admin = await this.Admin.create({ nome, senha: hashedPassword });
        res.redirect('/admins');
    }

    async list(req, res) {
        const admins = await this.Admin.findAll();
        res.render('admins', { admins, messages: req.flash() });
    }

    async update(req, res) {
        const { id, nome, senha } = req.body;
        const hashedPassword = bcrypt.hashSync(senha, 10);
        await this.Admin.update({ nome, senha: hashedPassword }, { where: { id } });
        res.redirect('/admin');
    }

    async delete(req, res) {
        const { id } = req.params;
        await this.Admin.destroy({ where: { id } });
        res.redirect('/admin');
    }

    async getById(req, res) {
        const { id } = req.params;
        const admin = await this.Admin.findOne({ where: { id } });
        res.render('admin', { admin });
    }
}

module.exports = AdminController;