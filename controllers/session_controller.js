/***
	* GET /login/new
	* Recibe la petición para cargar el formulario que renderiza
	* la vista con el formulario de login
	* @param req: Objeto request
	* @param res: Objeto response
	*/
exports.new = function(req,res){
	// Se recuperan los errores de la sessión o se inicializa la variable errors
	var errors = req.session.errors || {};	
	// Se inicializa el atributo "errors" de la sesión
	req.session.errors = {};
	// Si hay errores se pasan a la pantalla de login para mostrarlos
	res.render('session/new',{errors:errors});
};



exports.create = function(req,res){
	console.log("session_controller.create() ====>");
	var login          = req.body.login;
	var password       = req.body.password;
	var userController = require('./users_controller.js');

	console.log("login: " + login + ",password: " + password)

	// El tercer parámetro de autenticar es una callback, por tanto, se llama a dicha
	// función cuando se ejecuta autenticar(), siempre cuando haya realizado su tarea.
	// Si algo ha ido mal en error se obtiene el objeto Error de javascript. Sino hay
	// error, entonces los datod del usuario en el parámetro user
	userController.autenticar(login,password,function(error,user){
		if(error) { 
			// Si hay error, se devulven los mensajes de error en la sesión, y se 
			// redirige a la pantalla de login.
			req.session.errors = [{'message': 'Se ha producido el siguiente error: ' + error}];
			res.redirect("/login");
			return;
		}

		// Si todo ha ido bien, se almacenan los datos del usuario en la sesión
		req.session.user = {id: user.id,username:user.username};
		// Se hace una redirección al path anterior a login
		res.redirect(req.session.redir.toString());
	});

};


exports.destroy = function(req,res) { 
	 console.log("session_controller.destroy() ====>");
	 // Se borra el objeto user de la sesión asociada a la request
	 delete req.session.user;
	 // Redirección al path anterior a logout, que está en la sesión en el parámetro redir
	 res.redirect(req.session.redir.toString());
};