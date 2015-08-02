// Se incluye el modelo
var model = require('../models/models.js');

/**
  * GET /quizes/statistics
  * Recupera las estadísticas de preguntas de la BBDD, y se renderiza la
  * vista que mostrará el resultado
  * @param req: Objeto request
  * @param res: Objeto response
  */
exports.show = function(req,res) {
  console.log('Ejecución statistics_controller.show() ===>');

  model.Quiz.findAll({include:[model.Comment]}).then(function(quizzes){
    var numTotalPreguntas = 0;
    var numTotalPreguntasSinComentarios = 0;
    var numTotalPreguntasConComentarios = 0;
    var numTotalComentarios = 0;
    var numMedioComentariosPorPregunta = 0;
    var errores = new Array();


    if(quizzes) { 
      // Número total de preguntas
      numTotalPreguntas = quizzes.length;

      for(var i=0;i<quizzes.length;i++){
        // Lista de comentarios de la pregunta
        var comentarios = quizzes[i].Comments;

        if(comentarios && comentarios.length>0) {
            numTotalComentarios += comentarios.length;
            numTotalPreguntasConComentarios++;
        } else
            numTotalPreguntasSinComentarios++;

      }// for

    }// if

    numMedioComentariosPorPregunta = numTotalComentarios/numTotalPreguntas;

    var estadistica = { numTotalPreguntas:numTotalPreguntas,numTotalComentarios:numTotalComentarios,numTotalPreguntasConComentarios:numTotalPreguntasConComentarios,numTotalPreguntasSinComentarios:numTotalPreguntasSinComentarios,numMedioComentariosPorPregunta:numMedioComentariosPorPregunta};
    res.render("statistics/show",{estadistica:estadistica,errors:errores});

  });
};