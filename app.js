// Se importan los diferentes módulos o paquetes
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// Si la sesión ha permanecido sin actividad más de 2 minutos, 
// se hace una redirección hacia la pantalla de login
var tiempoMaximoInactividad = 2;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Se instala el middleware express-partials. Se instala después de definir
// el mecanismo de vistas y ejs de express-partials, sino no funciona.
// hay que crear en views, un archivo layout.ejs con la estructura que tendrán 
// todas las páginas
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
// Se elimina el extend false para poder enviar arrays a través de POST
app.use(bodyParser.urlencoded());
// Se indica la semilla para cifrar la cookie
app.use(cookieParser('Quiz-2015'));
// Se instala el MW de express-session
app.use(session());
app.use(cookieParser());
// Se instala el middleware y se indica el nombre utilizado para 
// encapsular el método POST por el que sea, en este caso suele ser por PUT.
// HTML5 no permite el envio de formularios por PUT, sólo por POST o por GET.
// De ahí que se haga esto
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));


// Helpers dinamicos:
app.use(function(req, res, next) {
    console.log('Comprobación de sesiones');
  // si no existe lo inicializa
  if (!req.session.redir) {
    req.session.redir = '/';
  }

  console.log("path desde el que llega la petición: " + req.path);
  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout|\/user/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});


// Middleware de autologout
app.use(function(req,res,next){
  var date = new Date();

  var hora = date.getHours();
  var minutos = date.getMinutes();
  var segundos = date.getSeconds()


  if(req.session.user && req.session.momentoUltimaPeticion) {
    console.log("Comprobación de autologout");
    // Si el usuario se ha autenticado, se recupera el momento en el que lo ha realizado
    var momentoUltimaPeticion = req.session.momentoUltimaPeticion;
    var momentoActual = new Date().getTime();
    
    var resultado = momentoActual - momentoUltimaPeticion;
    // Se pasan los milisegundos a minutos
    var minutosTranscurridos = resultado/60000;
    
    if(minutosTranscurridos>tiempoMaximoInactividad) {

      console.log("========> La sesión ha caducado tras superar los " + tiempoMaximoInactividad + " de inactividad");
      // Se borra el atributo usuario de la sesión
      delete req.session.user;
      // se borra el atributo momentoUltimaPeticion de la sesión
      delete req.session.momentoUltimaPeticion;

      var errores = new Array();
      req.session.errors = [{'message': 'La sesión del usuario ha caducado tras superar los ' + tiempoMaximoInactividad + " minutos de inactividad"}];
      res.redirect('/login');
    } 

  }
    
  // Se almacena el momento actual
  req.session.momentoUltimaPeticion = new Date().getTime();
  // Se pasa el control al siguiente Middleware
  next();
});



app.use('/', routes);

    
// catch 404 and forward to error handler. Esta función se invoca 
// sólo si desde routes/index.js, no se resuelve un patch
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers



// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log("Middleware error desarrollo: " + err.message);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors:[]
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors:[]
    });
});



module.exports = app;
