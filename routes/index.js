var express = require('express');
var router = express.Router();
// Se importa el controlador de preguntas
var quizController = require('../controllers/quiz_controller');
// Se importa el controlador de comentarios
var commentController = require('../controllers/comment_controller');

var sessionController = require('../controllers/session_controller');


router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz',errors:[]});
});


router.get('/author',function(req,res){
   res.render('author',{errors:[]}) ;
});


// Autoload de comandos con :quizId. Permite gestionar errores
router.param('quizId',quizController.load);
router.param('commentId',commentController.load);

// Recupera todas las preguntas para listarlas
router.get('/quizes',quizController.index);

// Se carga el formulario que permite dar de alta nuevas preguntas
router.get('/quizes/new',sessionController.loginRequired,quizController.new);
// Muestra una determinada pregunta
router.get('/quizes/:quizId(\\d+)',quizController.show);
// Comprueba si la respuesta a la pregunta con id "quizId" es la correcta
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);
// Alta de una nueva pregunta
router.post("/quizes/create",sessionController.loginRequired,quizController.create);

// Carga el formulario de edición de una pregunta
router.get('/quizes/:quizId(\\d+)/edit',sessionController.loginRequired,quizController.edit);

// Procesa la edición/modificación de una pregunta
router.put('/quizes/:quizId(\\d+)',sessionController.loginRequired,quizController.update);

// Procesa el borrado de una determinada pregunta
router.delete('/quizes/:quizId(\\d+)',sessionController.loginRequired,quizController.destroy);

// Procesa la publicación de un comentario
router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',sessionController.loginRequired,commentController.publish);

// Muestra el formulario de creación de un nuevo comentario para una determinada pregunta
router.get('/quizes/:quizId(\\d+)/comments/new',commentController.new);
// Procesa una petición POST de grabación de una nuevo comentario para una determinada pregunta
router.post('/quizes/:quizId(\\d+)/comments',commentController.create);

// Petición para procesar la petición GET que solicita el formulario delogin
router.get('/login',sessionController.new);
// Petición para procesar la petición POST que crea la sesión de usuario
router.post('/login',sessionController.create);
// Petición para procesar la petición POST que cierra la sesión de usuario
router.get('/logout',sessionController.destroy);


module.exports = router;