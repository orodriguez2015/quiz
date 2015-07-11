var express = require('express');
var router = express.Router();
// Se precisa del controlador de quiz
var quizController = require('../controllers/quiz_controller');


router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});


router.get('/author',function(req,res){
   res.render('author') 
});


// Autoload de comandos con :quizId. Permite gestionar errores
router.param('quizId',quizController.load);

// Recuera todas las preguntas para listarlas
router.get('/quizes',quizController.index);
// Muestra una determinada pregunta
router.get('/quizes/:quizId(\\d+)',quizController.show);
// Comprueba si la respuesta a la pregunta con id "quizId" es la correcta
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);



module.exports = router;