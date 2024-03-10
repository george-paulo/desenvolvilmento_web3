// auth.js
const { verifyToken } = require('../utils/jwt');

function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.session.originalUrl = req.originalUrl;
        return res.redirect('/admin/login');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
        req.session.originalUrl = req.originalUrl;
        return res.redirect('/admin/login');
    }

    req.user = payload;
    next();
}

module.exports = auth;