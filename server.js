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

app.get('/new_photo', function(req, res){
  res.render('newphoto');
});

app.use('/gallery', require('./routes/gallery'));

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