// Se incluye el modelo
var model = require('../models/models.js');


/**
  * Función que recupera todas las preguntas existentes en la tabla QUIZ,
  * y renderiza la vista
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.index= function(req,res){

    model.Quiz.findAll().then(function(quizes){
      console.log("Numero de preguntas recuperadas: " + quizes.length);
      res.render('quizes/index',{quizes:quizes});

    });
};


// 
/**
  * GET /quizes/:quizId
  * Función que recibe la petición para mostrar una determinada pregunta
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.show = function(req,res){
  // Se obtiene una determinada pregunta
  model.Quiz.find(req.params.quizId).then(function(quiz){
      res.render('quizes/show',{quiz:quiz});

  }).catch(function(err){

    console.log("Error al recuperar la pregunta:  " + err);
  });

};


/**
  * GET /quizes/:quizId/answer
  * Función que recibe la petición para comprobar si la respuesta a una pregunta de id "quizId"
  * es la correcta
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.answer= function(req,res){
    console.log('Procesando respuesta ===> ');

    model.Quiz.find(req.params.quizId).then(function(quiz){
        // Si se ha podido recuperar los elementos de la BBDD, nos quedamos con el primero
        
        if(req.query.respuesta!=undefined && req.query.respuesta.toUpperCase()==quiz.respuesta.toUpperCase()){
            res.render('quizes/answer',{respuesta:'correcta'});    
        } else {
            res.render('quizes/answer',{respuesta:'incorrecta'});
        }
    });
};