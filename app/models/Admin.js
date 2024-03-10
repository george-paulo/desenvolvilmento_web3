const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = async (sequelize) => {
    const Admin = sequelize.define('Admin', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                const hash = bcrypt.hashSync(value, 10);
                this.setDataValue('senha', hash);
            }
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
        return bcrypt.compareSync(password, this.senha);
    };

    await Admin.sync();

    return Admin;
};