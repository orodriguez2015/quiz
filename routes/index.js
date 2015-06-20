var express = require('express');
var router = express.Router();
// Se precisa del controlador de quiz
var quizController = require('../controllers/quiz_controller');


router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});


router.get('/quizes/question',quizController.question);
router.get('/quizes/answer',quizController.answer);

module.exports = router;