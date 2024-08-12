// models/blog.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
      Blog.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author'
      });
    }
  }

  Blog.init({
    title: DataTypes.STRING,
    desk: DataTypes.TEXT,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    image: DataTypes.STRING,
    duration: DataTypes.STRING,
    technologies: DataTypes.STRING,  // Kolom baru untuk menyimpan teknologi
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Pastikan ini diatur ke false
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Blog',
  });

  return Blog;
};


