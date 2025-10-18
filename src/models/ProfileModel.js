const { DataTypes } = require('sequelize');
const { sequelize } = require("../config/database.js");

const Profile = sequelize.define('profile', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
    allowNull: true, // Permitir nulos para fechas de modificación/baja
    defaultValue: null
  },
  UserBaja: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  FechaBaja: {
    type: DataTypes.DATE,
    allowNull: true, // Permitir nulos para fechas de modificación/baja
    defaultValue: null
  },
});

module.exports = { Profile };