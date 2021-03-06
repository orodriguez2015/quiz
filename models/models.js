/**
  En este archivo se crea la BBDD y se exporta los objeto que trabajan
  con las tablas que la forman **/

var path = require('path');



// URL POSTGRESQL  postgres://xanvvmotjozllo:2ZY1IpqoQZ6Lzw0kkRQ5-ThXU5@ec2-23-23-188-252.compute-1.amazonaws.com:5432/d8jl7qmlc3njgn
// URL SQLITE      sqlite://:@:/

// Con process.env se obtiene los datos del entorno, en local como tenemos
// el archivo .env se toman los datos del entorno local.
// En heroku, ya existe la variable de entorno DATABASE_URL

console.log("process.env.DATABASE_URL: " + process.env.DATABASE_URL);
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user    = (url[2] || null);
var pwd     = (url[3] || null);
var protocol= (url[1] || null);
var dialect = (url[1] || null);
var port    = (url[5] || null);
var host    = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;  


console.log("url: " + url);
console.log("DB_name: " + DB_name);
console.log("user: " + user);
console.log("pwd: " + pwd);
console.log("protocol: " + protocol);
console.log("dialect: " + dialect);
console.log("port: " + port);
console.log("host: " + host);
console.log("storage: " + storage);
console.log("");

// Se carga el modelo ORM
var Sequelize = require('sequelize');

// Se indica a sequelize que se usa una BBDD sqllite y se da un nombre a la misma
var sequelize  = new Sequelize(DB_name, user, pwd, 
  { dialect: dialect,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage, // Sólo para sqllite 
    omitNull: true    // Sólo postgresql
  }
 );



// Se importa la definición de la tabla quiz del archivo quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Se importa la definición de la tabla comment de la base de datos
var Comment = sequelize.import(path.join(__dirname,'comment'));

// Se define la relación 1 a N, entre la tabla "quiz" y "comment"
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);


// Se exporta la definición de la tabla quiz, para que se pueda utilizar donde sea preciso,
// por ejemplo, en los controladores de la aplicación
exports.Quiz = Quiz;
// Se exporta la definición de la tabla Comment
exports.Comment = Comment;

/** 
  * Esta llamada crea e inicializa la base de datos quiz.sqllite.
  * Además si la tabla QUIZ no tiene valores, entonces, se inserta uno por defecto.
  * Se hace uso de promesas utilizando la función then, que se ejecuta
  * cuando se ejecutado correctamente el método sync(), y la promesa catch en caso 
  * de que se haya producido un error
  */
sequelize.sync().then(function(data) {
    
   console.log("BASE DE DATOS CREADA");    
   Quiz.count().then( function(count) {
       console.log("Número de elementos : " + count);
        if(count==0) {
            
            Quiz.create( {  pregunta: '¿ Cuál es la capital de Italia ?',
                            respuesta: 'Roma',
                            categoria: 'geografia'}).
            then(function(data){
                console.log("TABLA QUIZ INICIALIZADA");    
            }).
            catch(function(err){
               console.log("ERROR AL CREAR LA TABLA QUIZ"); 
            });



            Quiz.create( {  pregunta: '¿ Cuál es la capital de Portugal ?',
                            respuesta: 'Lisboa',
                            categoria: 'geografia'}).
            then(function(data){
                console.log("TABLA QUIZ INICIALIZADA");    
            }).
            catch(function(err){
               console.log("ERROR AL CREAR LA TABLA QUIZ"); 
            });
         
        }
    }).
   catch(function(err){
       console.log(" ERROR AL CONTAR LOS ELEMENTOS DE LA TABLA QUIZ: " + err);
   });
}).catch(function(err){
   console.log(" ERROR AL CREAR LA BASE DE DATOS"); 
});




