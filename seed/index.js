var models = require('../models');

var faker = require('faker');

models.sequelize
  .sync({force:true})

  .then(function(){
    //Add Images
    var imageData = [];
    var TOTAL_IMAGES = faker.random.number({min:5, max:10});
    var categories = ['food', 'nature', 'abstract', 'animals', 'cats'];
    for (var i = 0; i < TOTAL_IMAGES; i++){
      imageData.push({
        author: faker.name.firstName(),
        link: faker.image.imageUrl(640, 480, faker.random.arrayElement(categories)),
        description: faker.lorem.sentences()
      });
    }
    return models.Gallery
      .bulkCreate(imageData, {returning: true});
  });