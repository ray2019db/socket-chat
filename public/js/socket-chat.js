// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Cargar el módulo para el trabajo con Sockets
// ----------------------------------------------------------------------------------------------------------------------------------------------------
var socket = io(); // Almacena el método "io()" de la librería "socket.io/socket.io.js" importada en el archivo "chat.html" para establecer la conexión entre sockets. Se usa "var" y no "let" para aumentar la compatibilidad con los navegadores

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Obtener parámetros de búsqueda que vienen por la URL
// ----------------------------------------------------------------------------------------------------------------------------------------------------
var params = new URLSearchParams(window.location.search); // Almacena todos los parámetros de búsqueda que vienen por el url

if (!params.has('nombre') || !params.has('sala')) { // Si en los "params" NO viene el parámetro de búsqueda "nombre" "has('nombre')" O (||) "sala" "has('sala')" por ej: "http:///ocalhost:3000/chat.html?nombre=Perico&sala=moda"
    window.location = 'index.html'; // Redireciona a la página del archivo "index.html"
    throw new Error('Necesita Insertar un Nombre'); // Dispara un error con el sgte mensaje. el "throw new Error()" cumple la función de retornar el código para que no se siga ejecutando e imprimir en consola el mensaje especificado como si fuera un "console.log"
}
var usuario = { // Almacena en un objeto el valor de los parámetros de búsqueda "nombre" y "sala" pasado por la url { nombre: 'Xxxxx', sala: 'xxxxxxxx' }
    nombre: params.get('nombre'), // Con el método "params.get()" yo puedo obtener el valor de un parámetro de búsqueda dentro de la url, en este caso estoy capturando el parámetro "nombre" pasado por la url
    sala: params.get('sala') // Con el método "params.get()" yo puedo obtener el valor de un parámetro de búsqueda dentro de la url, en este caso estoy capturando el parámetro "sala" pasado por la url
};
//------------------------------------------Fin Obtener parámetros de búsqueda mediante la URL-----------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Establecer conexión del Socket del Cliente con el Socket del Servidor
// ----------------------------------------------------------------------------------------------------------------------------------------------------
socket.on('connect', function() { // Establece la conexión con el socket.io del servidor. Tiene 2 parámetros, el 1ro tal cual literal 'connect' y el 2do un callback que ejecuta su contenido (no usu función de flecha para aumentar compatibilidad ya que no sé si soporta ES6). El método "on()" se emplea para escuchar información (siempre estará escuchando o atento a la conexión, en este caso con el servidor)
    console.log('Conectado al Servidor');

    // ----------------------------------------------------------------------------------------------------------------------------------------------------
    // Emitir Evento "entrarChat"
    // ----------------------------------------------------------------------------------------------------------------------------------------------------
    socket.emit('entrarChat', usuario, function(resp) { // Emite un evento (envía información) mediante el método "emit()". El 1er parámetro contiene el nombre del evento que se emite "entrarChat", el 2do es la "data" un objeto con el contenido que emito (envío) en el evento, en este caso es "var usuario" que contiene el nombre y la sala del usuario conectado pasado como parámetros de búsqueda en la url obtenido anteriormente en "var params = new URLSearchParams(window.location.search)" y almacenado en "var usuario" y el 3ro un callback que tiene como parámetro la respuesta "resp" retornada por el Socket Servidor
        console.log('Personas Conectadas: ', resp);
        renderizarUsuarios(resp); // Pinta (renderiza) en el HTML lon nombres de las personas conectadas a una misma Sala del Chat
        scrollBottom(); // Coloca el Scroll al final de la lista para que se pueda visualizar el último mensaje
    }); //------------------------------Fin de evento "entrarChat"-------------------------------------------------------------------------------------------------------

}); //-------------------------Fin Conexión con el Socket del Servidor-----------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Escuchar Evento "diconnect" para la desconexión con el Socket del Servidor
// ----------------------------------------------------------------------------------------------------------------------------------------------------
socket.on('disconnect', function() { // Se ejecuta cuando detecta que se perdió la conexión con el socket.io del servidor. Tiene 2 parámetros, el 1ro tal cual literal 'disconnect' y el 2do un callback que ejecuta su contenido. El método "on()" se emplea para escuchar información (siempre estará escuchando o atento a la conexión, en este caso estará atento a una desconexión del servidor)
    console.log('Perdimos la conexión con el Servidor');
}); //----------------------------------------------------------Fin del Evento "diconnect"-----------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Escuchar Evento "enviarMensaje" para mostrar el mensaje enviado por el Socket Server
// ----------------------------------------------------------------------------------------------------------------------------------------------------
socket.on('enviarMensaje', function(mensaje) { // Recibe un mensaje como respuesta del Socket Server en un objeto con la sgte estructura "{nombre: 'xxxxxx', mensaje: 'xxxxx', fecha: 'xxxxxxx'}"
    renderizarMensajes(mensaje, false); // Pinta en el html el mensaje recibido por el Socket Server. Tiene 2 parámetros el 1ro es el mensaje recibido por el Socket Server "{nombre: 'xxxxxx', mensaje: 'xxxxx', fecha: 'xxxxxxx'}" y un booleano a "false" para indicarle que es otro usuario el que ha escrito el mensaje
});
//-------------------------------------------------------------------------------------------------------------Fin----------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Escuchar Evento "mensajePrivado" para mostrar el mensaje enviado por el Socket Server de un usuario específico
// ----------------------------------------------------------------------------------------------------------------------------------------------------
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje Privado: ', mensaje);
});
//------------------------------------------------------------------------------------------------------------------Fin-----------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Escuchar Evento "personas" para mostrar todas las personas que pertenecen a una misma sala conectadas al Chat
// ----------------------------------------------------------------------------------------------------------------------------------------------------
socket.on('personas', function(personasPorSala) {
    console.log(personasPorSala);
    renderizarUsuarios(personasPorSala); // Pinta (renderiza) en el HTML lon nombres de las personas conectadas a una misma Sala del Chat
});
//------------------------------------------------------------------------------------------------------------------Fin-----------------------------------------------------------------

// // ----------------------------------------------------------------------------------------------------------------------------------------------------
// // Escuchar Evento 'crearMensaje' que devuelve en un objeto el Socket Server con un nombre de persona y un mensaje
// // ----------------------------------------------------------------------------------------------------------------------------------------------------
// socket.on('desconectarPersona', function(resp) {
//     console.log('Servidor: ', resp);
// }); //----------------------------------------------------------------------Fin de evento "crearMensaje"-------------------------------------------------------------------------------------------------------