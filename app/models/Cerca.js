const { DataTypes } = require('sequelize');
const getSequelize = require('../lib/database');

module.exports = async function() {
  const sequelize = await getSequelize();

  const Cerca = sequelize.define('Cerca', {
      nome: {
          type: DataTypes.STRING,
          allowNull: false
      },
      lado: {
          type: DataTypes.INTEGER,
          allowNull: false
      }
  }, {});

  // Cria as tabelas no banco de dados
  await sequelize.sync();

  return Cerca;
};
