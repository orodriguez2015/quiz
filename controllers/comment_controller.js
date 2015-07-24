var models = require('../models/models.js');


/**
 * GET /quizes/:quizId/comments/new
 * Carga la pantalla con el formulario de alta de un comentario
 * @param req: Objeto con la request
 * @param res: Objeto con la response
 */
exports.new = function(req,res){
	console.log('LLega la petición a comment_controller.new()');

	// Se crea un objeto Comment sin texto pero con QuizId de la pregunta,
	// para la que se crea el comentario
	var comment = models.Comment.build({
		texto: '',
		QuizId: req.params.quizId
	});

	// Se renderiza la vista comments/new.ejs, pasándole el quizId
	res.render('comments/new',{comment: comment,errors:[]});
};


/**
  * POST /quizes/:quizId/comments
  * Atiende a una petición de grabación de un comentario para una determinada pregunta
  * @param req: Objeto con la request
  * @param res: Objeto con la response
  */
exports.create = function(req,res){
	console.log("Petición enviada a comment_controller.create()");
	// Identificador de la pregunta para la que se crea el comentario
	var quizId = req.params.quizId;

	// Se crea un objeto Comment que se usará para que sea persistente en la BD
	// Por tratarse una relación de 1 a N entre la tabla "quiz" y "comment", automáticamente
	// sequelize crea un campo QuizId, que es la clave foránea de la tabla quiz en comment
	var comment = models.Comment.build({
		texto: req.body.comment.texto,
		QuizId: quizId});


	comment.validate().then(function(err){
		if(err) {
			// Si se ha producido un error al validar, se pasa el control a la página de entrada,
			// que no es más que el formulario de alta del comentario
			res.render("comments/new.ejs",{comment:comment,errors:err.errors});
		} else {
			// Si se ha validado correctamente, entonces, se procede a dar de
			// alta el comentario en BD
			comment.save({fields:["texto","QuizId"]}).then(function(){
				// Se redirige a la pregunta en concreto para poder contestarla, y 
				// ver la lista de comentarios de la misma
				res.redirect("/quizes/" + quizId);

			});
		}
	}).catch(function(error){
		next(error);
	});
}