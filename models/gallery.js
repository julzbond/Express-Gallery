'use strict';
module.exports = function(sequelize, DataTypes) {
  var Gallery = sequelize.define('Gallery', {
    author: DataTypes.TEXT,
    link: DataTypes.TEXT,
    description: DataTypes.TEXT
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        models.Gallery.belongsTo(models.User, {foreignKey: 'user_id'});
      }
    }
  });
  return Gallery;
};