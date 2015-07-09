/**
  * Se define la tabla Quiz de la BBDD
  * @param sequelize: Objeto de tipo Sequelize
  * @param DataTypes: Objeto DataTypes con los tipos de datos de campos
                      de base de datos, con los que trabaja sequelize.js
  */                      
module.exports = function(sequelize,DataTypes){
    return sequelize.define('Quiz',
            { pregunta: DataTypes.STRING,
              respuesta: DataTypes.STRING
            }
    );  
};