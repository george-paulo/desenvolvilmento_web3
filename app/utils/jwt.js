// utils/jwt.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key'; // Substitua por sua própria chave secreta

function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (e) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };