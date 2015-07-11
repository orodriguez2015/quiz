// Se incluye el modelo
var model = require('../models/models.js');


/**
  * Función que recupera todas las preguntas existentes en la tabla QUIZ,
  * y renderiza la vista
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.index= function(req,res){

    console.log("Buscando: " + req.query.search);

    // Se implementa un buscador
    var search = '%'

    // Si no existe un valor para el campo search, entonces se le asigna un 
    // valor por defecto, para que se busquen todas las preguntas
    if(req.query.search!=undefined && req.query.search.length>0){
      var resultado = req.query.search.replace(' ','%');
      console.log("buscar resultado: " + resultado);
      search = '%' + resultado + '%';

    }

    model.Quiz.findAll({where: ["pregunta like ?",search]}).then(function(quizes){
      
      console.log("Numero de preguntas recuperadas: " + quizes.length);
      res.render('quizes/index',{quizes:quizes});

    }); 
};



/**
   * Función de autoload para todas aquellas peticiones que tengan en su url el
   * parámetro :quizId. Recupera la pregunta, y ha ido todo bien, con la función next()
   * se pasa el control al middleware que corresponde, en caso contrario, se pasa el 
   * control al Middleware de errores de express */
exports.load = function(req,res,next,quizId){

  model.Quiz.find(quizId).then(function(quiz){
    if(quiz){ 
      // Se ha recuperado la pregunta, con next() se pasa el control al MW
      // que corresponda según la petición realizada en la URL
      req.quiz = quiz;
      next();
    }else{
      console.log("El quiz " + quizId + " no existe");
      next(new Error("El quiz " + quizId + " no existe"));
    }

  }).catch(function(error){
      // Si salta un error, se pasa el control al MW de errores de express definido
      // en app.js
      next(error);
  });

};

 
/**
  * GET /quizes/:quizId
  * Función que recibe la petición para mostrar una determinada pregunta
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.show = function(req,res){

  res.render('quizes/show',{quiz:req.quiz});

};


/**
  * GET /quizes/:quizId/answer
  * Función que recibe la petición para comprobar si la respuesta a una pregunta de id "quizId"
  * es la correcta
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.answer= function(req,res){
    console.log('Procesando quiz_controller.answer() ===> ');

    var _respuesta = 'incorrecta'
    // La petición llega de la función load(), por tanto, el quiz ya se encuentra en la 
    // request, porque ha sido obtenido de BD en la función load();
    if(req.query.respuesta!=undefined && req.query.respuesta.toUpperCase()==req.quiz.respuesta.toUpperCase()){
        _respuesta = 'correcta';
    }

    res.render('quizes/answer',{respuesta:_respuesta});
    
};