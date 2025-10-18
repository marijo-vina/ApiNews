const { Sequelize } = require('sequelize');
require('dotenv').config();

// Creamos una instancia de Sequelize con la configuración desde el archivo .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida exitosamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1); // Salir del proceso con error
  }
};

module.exports = { sequelize, connectDB };
