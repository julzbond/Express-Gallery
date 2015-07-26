var models = require('../models');

var faker = require('faker');

models.sequelize
  .sync({force:true})

  .then(function(){
    //Add Users
    var userData = [];
    var TOTAL_USERS = faker.random.number({min:1, max: 10});
    for(var i=0; i < TOTAL_USERS; i++){
      userData.push({
        username: faker.name.firstName(),
        password: faker.name.lastName()
      });
    }
    return models.User
      .bulkCreate(userData, { returning: true });
  })

  .then(function(users){
    //Add Images
    var imageData = [];
    var TOTAL_IMAGES = faker.random.number({min:5, max:10});
    var categories = ['city', 'nightlife', 'fashion', 'transport'];
    for (var i = 0; i < TOTAL_IMAGES; i++){
      imageData.push({
        author: faker.name.firstName(),
        link: faker.image.imageUrl(800, 480, faker.random.arrayElement(categories)),
        description: faker.lorem.sentences()
      });
    }
    return models.Gallery
      .bulkCreate(imageData, {returning: true})

      .then(function(images){
        images.forEach(function(image){
          var user = faker.random.arrayElement(users);
          user.addGallery(image);
        });
        return images;
      });
  });