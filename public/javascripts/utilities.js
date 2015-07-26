function primeraLetraMayusculas(palabra) {	
  var salida = '';

  if(palabra!=null && palabra!=undefined && palabra.length>=1){
    salida = palabra.substring(0,1).toUpperCase() + palabra.substring(1,palabra.length).toLowerCase();

  }
  return salida;
}