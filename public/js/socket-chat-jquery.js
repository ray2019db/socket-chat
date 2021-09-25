// ----------------------------------------------------------------------------------------------------------------------------
// Obtener el "nombre" del usuario y la "sala" del Chat mediante los parámetros de búsqueda de la url
// ----------------------------------------------------------------------------------------------------------------------------
var param = new URLSearchParams(window.location.search); // Almacena todos los parámetros de búsqueda que vienen a través de la url
var nombre = param.get('nombre'); // Almacena el nombre del usuario que viene como parámetro de búasqueda mediante la url
var sala = param.get('sala'); // Almacena la sala del Chat a la cual pertenece el usuario que viene como parámetro de búasqueda mediante la url

// ----------------------------------------------------------------------------------------------------------------------------
// Obtener Referencias de los elementos html
// ----------------------------------------------------------------------------------------------------------------------------
var divUsuarios = $('#divUsuarios'); // Hace referencia a la lista sin ordenar de usuarios (elemento <ul>) de la vista html mediante JQuery
var formEnviar = $('#formEnviar'); // Hace referencia al formulario de enviar mensaje <form> mediante JQuery
var txtMensaje = $('#txtMensaje'); // Hace referencia al formulario de enviar mensaje <form> mediante JQuery
var divChatbox = $('#divChatbox'); //Hace referncia a la lista desordenada <ul> de los mensajes en la vista html


// ----------------------------------------------------------------------------------------------------------------------------
// Función para Renderizar (Mostrar en el HTML) los Usuarios del Chat (Mostrar todos los usuarios conectados a una sala del Chat en la vista html)
// ----------------------------------------------------------------------------------------------------------------------------
function renderizarUsuarios(personas) { // Se pasa como parámetro un arreglo de personas "[{persona1}, {persona2}, {...}]"

    var html = ''; // Almacenará el código html qe se va a pintar (renderizar) en la vista html

    // ----------------------------------------------------------------------------------------------------------------------------
    // Construye el <li> anidado dentro del <ul> para pintar la "Sala" del Chat en la vista html
    // ----------------------------------------------------------------------------------------------------------------------------
    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>'; // Muestra dentro del <span> anidado en el <a> el valor que contiene el parámetro de búsqueda "sala" que viene en el url "params.get('sala')"
    html += '</li>';
    //-------------------------------------------------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------------------------------
    // Construye un ciclo "for" para pintar los nombres de las personas (usuarios) conctadas a una misma Sala del Chat
    // ----------------------------------------------------------------------------------------------------------------------------
    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a id="clientId" data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>'; // Muestra dentro del <span> anidado en el <a> el nombre de la persona conectada "personas[i].nombre" y el "id" de dicha persona en un atributo personalizado (data-id="personas[i].id"), por lo general los atributos personalizados se le coloca la palabra "data" guión "-" y el nombre del atributo, eso es una norma pero en realidad se le puede poner cualquier nombre al atributo personalizado
        html += '</li>';
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------

    divUsuarios.html(html); // Pinta (renderiza) el contenido de "var html" dentro del elemento <ul> en la vista html    
}; //----------------------------------------------------------------------------------------------------Fin----------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------
// Función para Renderizar (Mostrar en el HTML) los Mensajes del Chat (Mostrar todos los mensajes de los usuarios conectados a una sala del Chat en la vista html)
// ----------------------------------------------------------------------------------------------------------------------------
function renderizarMensajes(mensaje, yo) { // Recibe como parámetro un mensaje en un objeto con la sgte estructura "{nombre: 'xxxxx', mensaje: 'xxxxx', fecha: 'xxxxxx'}" y un booleano "yo" para indicar si es el mismo usuario el que manda el mensaje (en ese caso "true") o es otro usuario (en este caso "false")

    var html = ''; // Almacenará el código html que se pintará en la vista cuando esta función sea llamada
    var fecha = new Date(mensaje.fecha); // Almacena la fecha que viene en el mensaje pasado como parámetro (la fecha viene en Segundos transcurridos desde 1970)
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var claseMensaje = 'info'; // Almacena el nombre de una clase que se aplicará al código html de la vista

    if (mensaje.nombre === 'Administrador') { // Si el nombre del usuario que viene en el mensaje es "Administrador"
        claseMensaje = 'danger'; // Cambia el valor de la clase "claseMensaje" de "info" a "danger"
    }

    if (yo) { // Si es el mismo usuario el que escribió el mensaje (si es true), muestra este código en la vista:
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else { // Si NO es el mismo usuario el que escribió el mensaje (si es false), muestra este otro código:
        html += '<li class="animated fadeIn">';

        if (mensaje.nombre !== 'Administrador') { // Si el nombre del usuario que envía el mensaje NO es "Administrador" pinta la sgte imagen en la vista html de lo contrario SI es "Administrador" entonces no muestres la sgte imagen
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-' + claseMensaje + '">' + mensaje.mensaje + '</div>'; // El valor de la clase "claseMensaje" simplemente mostrará el fondo del mensaje de color azul o rojo
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    divChatbox.append(html); // Pinta dentro de la lista desordenada <ul> el contenido de "html" que no es más que el código html que contiene esta variable
};
//-------------------------------------------------------------------------------------Fin--------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------
// Función para que el Scroll siempre aparezca al final y se pueda visualizar el último mensaje escrito o recibido en el Chat mediante JQuery. Cópiala tal cual y solo cambia el nombre del selector (en este caso "divChatbox") para emplearla en otra aplicación
// ----------------------------------------------------------------------------------------------------------------------------
function scrollBottom() { // Esta función se puede emplear en cualquier aplicación solo cambiando el selector <ul> que contiene todos los <li> "divChatbox" en este caso por el nombre que tenga el selector de otra aplicación donde se quiera emplear para lograr el efecto deseado (el scroll al final de la lista para visualizar los últimos mensajes o lo que sea que se liste)

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}
//---------------------------------------------------------------------------------Fin "scrollBottom()"-----------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------
// Listener Obtener el Id del usuario
// ----------------------------------------------------------------------------------------------------------------------------
$(divUsuarios).on('click', 'a', function() { // JQuery selecciona "divUsuarios" (elemento <ul> con el id="divUsuarios" dentro del html) y escucha el evento "click" en cualquier elemento <a> dentro de dicho <ul>
    var clientId = $(this).data('id'); // Almacena el valor que contiene el atributo personalizado "data('id')" (atributo "data-id" en el html) del elemento <a> "$(this)" (El "this" en este caso está apuntando al elemento <a> anidado en el <ul> del html) 
    if (clientId) { // Si existe
        console.log(clientId);
    }
});

// ----------------------------------------------------------------------------------------------------------------------------
// Listener para enviar el mensaje escrito dentro de la caja de texto <input>
// ----------------------------------------------------------------------------------------------------------------------------
formEnviar.on('submit', function(e) {
    e.preventDefault(); // Previene que se recargue el navegador al enviar información en el formulario
    if (txtMensaje.val().trim().length === 0) { // Si la longitud del texto "string" (lenght) escrito en la caja de texto (<input>) sin espacios al principio y al final "trim()" es "0". Con el método "val()" obtengo el valor o el texto escrito dentro del <input>. El método "trim()" elimina los espacios al inicio y al final de un string. En otras palabras si la caja de texto está vacía:
        return; // Retorna sin hacer nada
    }
    // ----------------------------------------------------------------------------------------------------------------------------
    // Emite evento "crearMensaje" con el mensaje escrito en la caja de texto
    // ----------------------------------------------------------------------------------------------------------------------------
    socket.emit('crearMensaje', { // Emite evento "crearMensaje" 
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) { // Recibo un "mensaje" como respuesta devuelto por el Socket del Servidor en un callback con la sgte estructura "{nombre: 'xxxxxx', mensaje: 'xxxxx', fecha: 'xxxxxxx'}" (ver escucha de evento "client.on('crearMensaje', ...)" en el Socket Server)
        txtMensaje.val('').focus(); // Limpia la caja de texto <input> "txtMensaje.val('')" y pon el cursor dentro de esta "focus()"
        renderizarMensajes(mensaje, true); // Pinta en el html el mensaje escrito en la caja de texto <input>. Tiene 2 parámetros, el mensaje devuelto por el Socket Server "{nombre: 'xxxxxx', mensaje: 'xxxxx', fecha: 'xxxxxxx'}" y un booleano en "true" para indicarle que es el mismo usuario el que está creando el mensaje
        scrollBottom(); // Coloca el Scroll al final de la lista para que se pueda visualizar el último mensaje
    });
});