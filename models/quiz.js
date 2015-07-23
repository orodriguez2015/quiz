/**
  * Se define la tabla Quiz de la BBDD
  * @param sequelize: Objeto de tipo Sequelize
  * @param DataTypes: Objeto DataTypes con los tipos de datos de campos
                      de base de datos, con los que trabaja sequelize.js
  */                      
module.exports = function(sequelize,DataTypes){

    // Al definir los atributos de la tabla QUIZ en el objeto ORM que lo representa,
    // se pueden introducir validaciones en sus campos
    return sequelize.define('Quiz',
            { pregunta:  { type: DataTypes.STRING, 
                           validate: {notEmpty: { msg:'Falta la pregunta'}}
                         },
              respuesta: { type: DataTypes.STRING, 
                          validate: { notEmpty: { msg: 'Falta la respuesta'}}

              },

              categoria: {
                type: DataTypes.STRING,
                validate: { notEmpty: { msg: 'Falta la categoría'}}

              }
            }
    );  

    /** original
    return sequelize.define('Quiz',
            { pregunta: DataTypes.STRING,
              respuesta: DataTypes.STRING
            }
    );  
   */
};