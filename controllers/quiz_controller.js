var model = require('../models/models.js');

/**
  * Función que recibe la petición para mostrar una determinada pregunta
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.question= function(req,res){
    // Se pasa el control a la vista views/quizes/question.ejs y se le pasa la pregunta
    // como parámetro
    res.render('quizes/question',{pregunta:'¿Cuál es la capital de Italia?'});
};




/**
  * Función que recibe la petición para mostrar la respuesta de una determinada pregunta
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.answer= function(req,res){
    console.log('Procesando respuesta ===> ');
    // Se comprueba si la respuesta a la pregunta es la correcta.
    // En función de esto se pasa el parámetro respuesta con el valor que corresponda
    // a la vista views/quizes/answer.ejs
    
    // El objeto quiz se ha exportado en models.js. Se puede obtener los elementos de la
    // BBDD
    model.Quiz.findAll().then(function(quiz){
        // Si se ha podido recuperar los elementos de la BBDD, nos quedamos con el primero
        
        if(req.query.respuesta!=undefined && req.query.respuesta.toUpperCase()==quiz[0].respuesta.toUpperCase()){
            res.render('quizes/answer',{respuesta:'correcta'});    
        } else {
            res.render('quizes/answer',{respuesta:'incorrecta'});
        }
    });
    
    /** original
    // La respuesta del usuario se obtiene de la request, y del objeto query porque
    // la petición se envía por GET desde el formulario
    if(req.query.respuesta!=undefined && req.query.respuesta.toUpperCase()=='ROMA') {
        res.render('quizes/answer',{respuesta:'correcta'});
    }
    else {
        res.render('quizes/answer',{respuesta:'incorrecta'});
    }
    */
};