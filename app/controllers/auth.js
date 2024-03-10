const { verifyToken } = require('../utils/jwt');

function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        req.session.originalUrl = req.originalUrl;
        return res.status(401).json({ error: 'Nenhum token fornecido' });
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
        return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = payload;
    next();
}

module.exports = auth;