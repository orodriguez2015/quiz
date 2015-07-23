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

    model.Quiz.findAll({where: ["upper(pregunta) like ?",search.toUpperCase()], order:[['pregunta', 'ASC']]}).then(function(quizes){
      
      console.log("Numero de preguntas recuperadas: " + quizes.length);
      res.render('quizes/index',{quizes:quizes,errors:[]});

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

  res.render('quizes/show',{quiz:req.quiz,errors:[]});

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

    res.render('quizes/answer',{respuesta:_respuesta,errors:[]});
    
};

/**
  * GET /quizes/new
  * Función del controlador que es llamada para renderizar la vista,
  * que muestra el formulario de alta de una nueva pregunta 
  * @param req: Objeto request
  * @param res: Objeto response
  */
exports.new = function(req,res){
  var quiz = model.Quiz.build({pregunta: '', respuesta: ''});
  res.render('quizes/new',{quiz:quiz,errors:[]});

};


/**
  * GET /quizes/new
  * Función del controlador que es llamada para renderizar la vista,
  * que muestra el formulario de alta de una nueva pregunta 
  * @param req: Objeto request
  * @param res: Objeto response
  */
exports.create = function(req,res){
  console.log("Ejecución función create en quiz_controller");
  // Se construye el objeto persistente a partir del objeto utilizado para 
  // crear el formulario

  console.log("pregunta: " + req.body.quiz.pregunta);
  console.log("respuesta: " + req.body.quiz.respuesta);
  console.log("categoria: " + req.body.quiz.categoria);

  var quiz = model.Quiz.build(req.body.quiz);


  quiz.validate().then(function(err){

    if(err) {
      res.render("quizes/new",{quiz:quiz,errors: err.errors});
    }else{

      // Se almacena el objeto pregunta. Se indica en el atributo fields, el array con
      // los campos que se van a almacenar
      quiz.save({fields:["pregunta","respuesta","categoria"]}).then(function(){
        console.log("Pregunta dada de alta");
        res.redirect('/quizes');
      }).catch(function(error){
        console.log("Error al dar de alta la pregunta: " + error.message);
        next(err);
      });
    }
  });
}




/**
  * GET /quizes/:quizId/edit
  * Función que recibe la petición para editar una determinada pregunta.
  * Como la URL para cargar el formulario tiene un parámetro quizId en router/index.js,
  * pasa por el autoload (función load), por tanto, ya se recupera el quiz de BD y se 
  * carga en la request
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.edit = function(req,res){
  // Se renderiza el formulario de edición con el quiz alojado en el req, por 
  // la función load que lo ha carga de BD. La lista de errores se pasa vacía
  res.render('quizes/edit',{quiz:req.quiz,errors:[]});

};

/**
  * PUT /quizes/:quizId
  * Función que graba en base de datos la modificación de una determinada pregunta
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.update = function(req,res){
  // La petición ha pasado por la función load(), por tanto, sólo se recupera el objeto
  var quiz = req.quiz; 
  
  // El objeto ORM quiz, se le actualizan las propiedades pregunta,respuesta y categoria, 
  //con lo que venga del formulario, del objeto quiz que representa a cada uno de los 
  // elementos del formulario
  quiz.pregunta  = req.body.quiz.pregunta;
  quiz.respuesta = req.body.quiz.respuesta;
  quiz.categoria = req.body.quiz.categoria;

  quiz.validate().then(function(err){
      if(err) {

        console.log("quiz_controller. error: "  + err.errors);
        // Si se ha producido un error, se redirige al formulario de edición, pasando
        // los errores
        res.render('quizes/edit',{quiz:quiz,errors:err.errors}) ;      
      }else {
        
        // Sino hay error, entonces se procede a llamar al método save() de quiz
        // Se indica además los campos que hay que almacenar. Como quiz se ha recupera
        // de BD en load() con su id, el método save() en lugar de dar de alta, actualiza.
        quiz.save({fields:["pregunta","respuesta","categoria"]}).then(function(){
          res.redirect('/quizes');
        }).catch(function(err){
            console.log("ERROR al editar una pregunta: " + err.message);
            next(err);
        });
      }
  });
};



/**
  * DELETE /quizes/:quizId
  * Función que elimina de la base de datos, una determinada pregunta
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.destroy = function(req,res){
  // La petición ha pasado por la función load(), por tanto, sólo se recupera el objeto
  var quiz = req.quiz; 
        
  // Sino hay error, entonces se procede a llamar al método save() de quiz
  // Se indica además los campos que hay que almacenar. Como quiz se ha recupera
  // de BD en load() con su id, el método save() en lugar de dar de alta, actualiza.
  quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(err){
      console.log("ERROR al editar una pregunta: " + err.message);
      next(err);
  });
   
};