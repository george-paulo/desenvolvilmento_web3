const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const Admin = sequelize.define('Admin', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        hooks: {
            beforeCreate: (admin) => {
                admin.senha = bcrypt.hashSync(admin.senha, 10);
            },
            beforeUpdate: (admin) => {
                if (admin.changed('senha')) {
                    admin.senha = bcrypt.hashSync(admin.senha, 10);
                }
            }
        }
    });

    Admin.prototype.validPassword = function(password) {
        const isPasswordValid = bcrypt.compareSync(password, this.senha);
        console.log(`Resultado da comparação de senha: ${isPasswordValid}`);
        return isPasswordValid;
    };
    
    return Admin;
};