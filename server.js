var express = require('express');
var app = express();

var path = require('path');
var bodyparser = require('body-parser');
var methodOverride = require('method-override');

var CONFIG = require('./config/config.json');
var db = require ('./models');

app.use(express.static(path.resolve(__dirname, 'public')));

app.set('views', './views');
app.set('view engine', 'jade');

app.use(bodyparser.urlencoded());

app.use(methodOverride(function(req, res){
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.get('/', function(req, res){
  db.Gallery
    .findAll()
    .then(function(pictures){
      res.render('gallery', { pictures: pictures });
    });
});

app.post('/gallery', function(req, res){
  db.Gallery
    .create({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
    });
  res.redirect('/');
});

app.get('/gallery/:id', function(req, res){
  var id = req.params.id;
  db.Gallery
    .findOne({
      where: {'id': id}
    })
    .then(function(picture){
      if (!picture){
        res.redirect('/');
      }
      res.render('singlephoto', { id: picture.id, author: picture.author, link: picture.link, description: picture.description});
    });
});

app.get('/new_photo', function(req, res){
  res.render('newphoto');
});


app.get('/gallery/:id/edit', function(req, res){
  var id = req.params.id;
  db.Gallery
    .findOne({
      where: {'id': id}
    })
    .then(function(picture){
      res.render('editphoto', { id: picture.id, author: picture.author, link: picture.link, description: picture.description});
    });
});

app.put('/gallery/:id', function(req,res){
  var id = req.params.id;
  // res.send('PUT request to gallery')
  db.Gallery
    .findOne({
      where: {'id': id}
    })
    .then(function(picture){
      return picture.updateAttributes(req.body);
    })
    .then(function(picture){
      return res.redirect('/gallery/' + id);
    });
});

app.delete('/gallery/:id', function(req, res){
  var id = req.params.id;
  // res.send('DELETE request to gallery')
  db.Gallery
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


db.sequelize
  .sync()
  .then(function(){
    var server = app.listen(CONFIG.port, displayServerInfo);
    function displayServerInfo(){
      var host = server.address().address;
      var port = server.address().port;
      console.log("Listening at http://%s:%s", host, port);
    }
  })
  .error(function(){
    console.log("Database is not running");
  });