var express = require('express');
var router = express.Router();

var db = require ('../models');
var Gallery = db.Gallery;

module.exports = router;

router.use(function(req, res, next){
  next();
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
        res.render('singlephoto', { id: picture.id, author: picture.author, link: picture.link, description: picture.description});
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
  .get(function(req, res){
    var id = req.params.id;
    Gallery
      .findOne({
        where: {'id': id}
      })
      .then(function(picture){
        res.render('editphoto', { id: picture.id, author: picture.author, link: picture.link, description: picture.description});
      });
  });