var express = require('express');
var router = express.Router();
// Se importa el controlador de preguntas
var quizController = require('../controllers/quiz_controller');
// Se importa el controlador de comentarios
var commentController = require('../controllers/comment_controller');


router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz',errors:[]});
});


router.get('/author',function(req,res){
   res.render('author',{errors:[]}) ;
});


// Autoload de comandos con :quizId. Permite gestionar errores
router.param('quizId',quizController.load);

// Recupera todas las preguntas para listarlas
router.get('/quizes',quizController.index);

// Se carga el formulario que permite dar de alta nuevas preguntas
router.get('/quizes/new',quizController.new);
// Muestra una determinada pregunta
router.get('/quizes/:quizId(\\d+)',quizController.show);
// Comprueba si la respuesta a la pregunta con id "quizId" es la correcta
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);
// Alta de una nueva pregunta
router.post("/quizes/create",quizController.create);

// Carga el formulario de edición de una pregunta
router.get('/quizes/:quizId(\\d+)/edit',quizController.edit);

// Procesa la edición/modificación de una pregunta
router.put('/quizes/:quizId(\\d+)',quizController.update);

// Procesa el borrado de una determinada pregunta
router.delete('/quizes/:quizId(\\d+)',quizController.destroy);


// Muestra el formulario de creación de un nuevo comentario para una determinada pregunta
router.get('/quizes/:quizId(\\d+)/comments/new',commentController.new);
// Procesa una petición POST de grabación de una nuevo comentario para una determinada pregunta
router.post('/quizes/:quizId(\\d+)/comments',commentController.create);


module.exports = router;