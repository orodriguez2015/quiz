/**
  * Se define la tabla Comment de la BBDD
  * @param sequelize: Objeto de tipo Sequelize
  * @param DataTypes: Objeto DataTypes con los tipos de datos de campos
                      de base de datos, con los que trabaja sequelize.js
  */                      
module.exports = function(sequelize,DataTypes){

    // Al definir los atributos de la tabla QUIZ en el objeto ORM que lo representa,
    // se pueden introducir validaciones en sus campos
    return sequelize.define('Comment',
            { 
              texto:  { type: DataTypes.STRING, 
                        validate: {notEmpty: { msg:'Falta el comentario'}}
                      }
            }
    );  
};