var users = {
			admin: {id:1,username:'admin',password:'1234'},
			pepe : {id:1,username:'pepe',password:'5678'}
};


/**
  * Comprueba si existe un determinado usuario en la base de datos
  * @param login: Login del usuario
  * @param password: Password del usuario
  * @param callback: Función javascript a la que se llama si el usuario y password
                     existen */	
exports.autenticar = function(login,password,callback){

	// Si existe el usuario y su password es la que se pasa como parámetro,
	// se llama a la función 
	if(users[login]) { 
		if(password == users[login].password) { 
			callback(null,users[login]);
		}else {
			callback(new Error('Contraseña incorrecta'));
		}
	}else
		callback(new Error('No existe el usuario'));
};