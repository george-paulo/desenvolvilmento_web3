const bcrypt = require('bcrypt');
const getAdmin = require('../models/Admin');
const getSequelize = require('../lib/database');
const { generateToken } = require('../utils/jwt');

class AdminController {
    constructor() {
        this.Admin = null;
        this.initPromise = this.init();
    }

    async init() {
        const sequelize = await getSequelize();
        this.Admin = await getAdmin(sequelize);
        await this.Admin.sync();
    }

    login(req, res) {
        const { nome, senha } = req.body;
    
        return this.Admin.findOne({ where: { nome: nome } })
            .then(admin => {
                if (!admin) {
                    return res.status(400).json({ error: 'Administrator não existe' });
                } else {
                    return bcrypt.compare(senha, admin.senha)
                        .then(isMatch => {
                            if (isMatch) {
                                const token = generateToken({ id: admin.id });
                                return res.json({ token });
                            } else {
                                return res.status(400).json({ error: 'Senha Inválida' });
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            return res.status(500).json({ error: 'Erro interno do servidor' });
                        });
                }
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            });
    }

    showLoginForm(req, res) {
        res.render('login', { messages: req.flash() });
    }

    async create(req, res) {
        const { nome, senha } = req.body;
        const hashedPassword = await bcrypt.hash(senha, 10);
        const admin = await this.Admin.create({ nome, senha: hashedPassword });
        if (res && typeof res.redirect === 'function') {
            res.redirect('/admins');
        }
    }

    async list(req, res) {
        const admins = await this.Admin.findAll();
        res.render('admins', { admins, messages: req.flash() });
    }

    async update(req, res) {
        const { id, nome, senha } = req.body;
        const hashedPassword = await bcrypt.hash(senha, 10);
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

module.exports = () => {
    const controller = new AdminController();
    return controller.initPromise.then(() => controller);
};