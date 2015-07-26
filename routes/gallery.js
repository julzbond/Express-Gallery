var express = require('express');
var router = express.Router();

var db = require ('../models');
var Gallery = db.Gallery;

module.exports = router;

router.use(function(req, res, next){
  if (req.method.toUpperCase() !== "GET") {
    isAuthenticated(req, res, next);
  }
  else {
    next();
  }
});

router.route('/')
  .post(function(req, res){
    Gallery
      .create({
        author: req.body.author,
        link: req.body.link,
        description: req.body.description
      });
      res.redirect('/');
  });

router.route('/:id')
  .get(function(req, res){
    var id = req.params.id;
    Gallery
      .findOne({
        where: {'id': id}
      })
      .then(function(picture){
        if (!picture){
          res.redirect('/');
        }
        Gallery
          .findAll({
            where: {
              'id': {
                $not: picture.id
              }
            },
            order: [
              [db.Sequelize.fn('RANDOM')]
            ],
            limit: 3
          })
          .then(function(pictures){
            res.render('singlephoto', { singleImg: picture,  sidebarImages: pictures});
          });
      });
  })
  .put(function(req, res){
    var id = req.params.id;
    Gallery
      .findOne({
        where: {'id': id}
      })
      .then(function(picture){
        return picture.updateAttributes(req.body);
      })
      .then(function(picture){
        return res.redirect('/gallery/' + id);
      });
  })
  .delete(function(req, res){
    var id = req.params.id;
    Gallery
      .findOne({
        where: {'id': id}
      })
      .then(function(picture){
        return picture.destroy({ force: true });
      })
      .then(function(){
        return res.redirect('/');
      });
  });

router.route('/:id/edit')
  .get(
    isAuthenticated,
    function(req, res){
      var id = req.params.id;
      Gallery
        .findOne({
          where: {'id': id}
        })
        .then(function(picture){
          Gallery
            .findAll({
            where: {
              'id': {
                $not: picture.id
              }
            },
            order: [
              [db.Sequelize.fn('RANDOM')]
            ],
            limit: 3
            })
            .then(function(pictures){
              res.render('editphoto', { singleImg: picture,  sidebarImages: pictures});
            });
        });
  });

function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else {
    res.redirect('/login');
  }
}