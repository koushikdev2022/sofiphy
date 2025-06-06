'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CresModel extends Model {
    
    static associate(models) {
    
    }
  }
  CresModel.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
     shop1_api_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shop1_api_secret: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shop1_access_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shop1_domain: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    sequelize,
    modelName: 'CresModel',
    tableName: 'creds',
    timestamps: false, 
    underscored: true,
  });
  return CresModel;
};