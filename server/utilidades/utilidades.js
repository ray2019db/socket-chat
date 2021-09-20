const crearMensaje = (nombre, mensaje) => { // Función que retorna un objeto con la sgte estructura (estructura de un mensaje)
    return {
        nombre,
        mensaje,
        fecha: new Date().getTime() // devuelve la hora en milisegundos (tiempo transcurrido en milisegundos desde el 1ro de enero de 1970 hasta el momento actual)
    };
};

module.exports = { crearMensaje }; // Exporta la función "crearMensaje()" para que pueda ser utilizada en cualquier archivo que la importe de la aplicación