const { DataTypes } = require('sequelize');
const { sequelize } = require("../config/database.js");

const Category = sequelize.define('category', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  UserAlta: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Admin",
  },
  FechaAlta: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  UserMod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  FechaMod: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  UserBaja: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  FechaBaja: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
});

module.exports = { Category };
