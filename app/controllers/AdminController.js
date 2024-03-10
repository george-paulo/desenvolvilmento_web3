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
    
    const token = generateToken({ id: admin.id, nome: admin.nome });
    const originalUrl = req.session && req.session.originalUrl ? req.session.originalUrl : '/admin';
    if (req.session) {
        delete req.session.originalUrl;
    }
    res.redirect(originalUrl);
}
 
    showLoginForm(req, res) {
    res.render('admin/login', { messages: req.flash() });
}

    async create(req, res) {
        const { nome, senha } = req.body;
        const admin = await this.Admin.create({ nome, senha });
        res.redirect('/admins');
    }

    async list(req, res) {
        const admins = await this.Admin.findAll();
        res.render('admins', { admins, messages: req.flash() });
    }

    async update(req, res) {
        const { id, nome, senha } = req.body;
        await this.Admin.update({ nome, senha }, { where: { id } });
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