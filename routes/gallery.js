var express = require('express');
var router = express.Router();

var db = require ('../models');
var Gallery = db.Gallery;

module.exports = router;

router.use(function(req, res, next){
  next();
});

router.route('/')
  .get(function(req, res){
    Gallery
      .findAll()
      .then(function(pictures){
        res.render('gallery', { pictures: pictures });
      });
  })
  .post(function(req, res){
    Gallery

  })