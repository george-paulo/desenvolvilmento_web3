const bcrypt = require('bcrypt');

// Cria um hash de uma senha conhecida
const password = '123456';
const hash = bcrypt.hashSync(password, 10);

console.log('Hash:', hash);

// Verifica a senha contra o hash
const isPasswordValid = bcrypt.compareSync(password, hash);

console.log('Is password valid:', isPasswordValid);