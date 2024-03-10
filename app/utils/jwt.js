const jwt = require('jsonwebtoken');
const secret = process.env.SEGREDO_JWT;

function generateToken(user) {
    return jwt.sign({ id: user.id, nome: user.nome }, secret, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (e) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };