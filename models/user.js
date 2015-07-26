'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.TEXT,
    password: DataTypes.TEXT
  }, {
    underscored:true,
    classMethods: {
      associate: function(models) {
        models.User.hasMany(models.Gallery);
      }
    }
  });
  return User;
};