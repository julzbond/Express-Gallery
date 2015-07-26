var express = require('express');
var app = express();

var path = require('path');
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

var CONFIG = require('./config/config.json');
var db = require ('./models');

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyparser.urlencoded({extended: false}));
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User
      .findOne({
        where: {
          username: username }
        })
      .then(function(user){
        if(user === null){
          return done(null, false, { message: 'User not found.'});
        }
        if(user.password !== password){
          return done(null, false, { message: 'Password is incorrect' });
        }
        return done(null, user);
      })
      .catch(function(error){
        console.log(error);
      });
    }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.User
    .findById(id)
    .then(function(user){
      done(null, user);
    });
});

app.use(methodOverride(function(req, res){
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect:'/login'
  })
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/', function(req, res){
  db.Gallery
    .findAll()
    .then(function(pictures){
      var mainImg = pictures.shift();
      res.render('gallery', { user: req.user || null, mainImg: mainImg, pictures: pictures });
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