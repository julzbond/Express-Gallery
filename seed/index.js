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
    var architectureImages = ['http://www.e-architect.co.uk/images/jpgs/london/architecture_foundation_hq_af061207_1.jpg', 'http://assets.inhabitat.com/wp-content/blogs.dir/1/files/2010/08/Rematerial-Book-Review-2.jpg', 'http://www.designcurial.com/Uploads/NewsArticle/947159/main.jpg', 'http://www.e-architect.co.uk/images/jpgs/poland/warsaw_manfredinicoletti170308_2.jpg', 'http://www.wallpaperhi.com/thumbnails/detail/20111128/valencia-spain-modern-architecture-1024x768.jpg', 'http://essenziale-hd.com/wp-content/uploads/2012/10/91acb518b5151.jpg', 'http://images2.fanpop.com/image/photos/9700000/Taj-Mahal-architecture-9735166-800-600.jpg', 'http://artdigitaldesign.com/3d-optical-illusion-popart/12modern-architecture/modern-architecture08.jpg'];
    for (var i = 0; i < 7; i++){
      imageData.push({
        author: faker.name.firstName(),
        link: architectureImages[i],
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