const { io } = require('../server'); // Importar la constante "io" del archivo '../server.js' que es quien maneja la comunicación del Socket en el Servidor

const { Usuarios } = require('../classes/usuarios'); // Importar la clase "Usuarios" para poder emplear todos sus métodos y propiedades en este archivo

const usuarios = new Usuarios(); // Instanciar la clase "Usuarios" en la constante "usuarios" para poder usar todos sus métodos y propiedades

const { crearMensaje } = require('../utilidades/utilidades'); // Importar la función "crearMensaje()" del archivo "../utilidades/utilidades" para poder emplearla en este archivo

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Establecer conexión del Socket del Servidor con el Socket del Cliente
// ----------------------------------------------------------------------------------------------------------------------------------------------------
io.on('connection', (client) => { // Establece la conexión con el Socket del Cliente. Tiene 2 parámetros, el 1ro tal cual literal 'connection' (nombre de este evento por defecto) y el 2do un callback que ejecuta su contenido y pasa como parámetro los datos del cliente "client" (los datos de la PC cliente que está conectada)

        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        // Escuchar Evento "entrarChat" una vez establecida la conexión entre el Socket Cliente y el Socket Servidor
        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        client.on('entrarChat', (usuario, callback) => { // Con el método "on()" puedo escuchar los eventos emitidos por los usuarios (client). El 1er parámetro es el nombre del evento a escuchar "entrarChat" y el 2do es un callback que ejecuta su contenido y tiene como parámetro en este caso el "usuario" (objeto) enviado por el usuario (cliente) dentro del evento "entrarChat" y un callback que devolverá la respuesta al cliente que emitió el evento

            if (!usuario.nombre || !usuario.sala) { // Si en el objeto "usuario" enviado por el cliente como data NO existe la clave "nombre":
                return callback({ // Devuelve en el callback el sgte objeto
                    err: true,
                    message: 'Es necesario insertar el Nombre o la Sala'
                });
            } // Si existen las claves "nombre" y "sala" dentro del objeto "usuario" enviado por el cliente en la data del evento

            client.join(usuario.sala); // Con el método "join()" se une el cliente a la sala pasada como parámetro

            usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala); // Agrega al arreglo de personas "this.personas" de la clase "Usuarios" una persona mediante el método "agregarPersona()" que tiene como parámetros el "id = clien.id" creado automáticamente por el Socket del Servidor cuando el cliente se conecta con este, el "nombre = usuario.nombre" que viene en la data del evento emitido y la "sala = usuario.sala" que viene en la data del evento emitido
            client.broadcast.to(usuario.sala).emit('personas', usuarios.getPersonasPorSala(usuario.sala)); // Emite un evento "broadcast" para todos los Sockets Clientes que pertenecen a la misma sala. Devuelve un arreglo de todas las personas conectadas al chat que pertenecen a la misma sala
            callback(usuarios.getPersonasPorSala(usuario.sala)); // Devuelve en el callback las personas almacenadas dentro del arreglo "let personas"
        }); //------------------------------------------Fin Evento "escucharChat"-------------------------------------------------------------------------------

        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        // Escucha el evento "crearMensaje" para enviarlo a los Sockets Clientes del Socket Servidor
        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        client.on('crearMensaje', (data) => {
            let persona = usuarios.getPersona(client.id); // Almacena los datos de la persona en un objeto ""{ id: 'xxxxxxxxxxxx', nombre: 'xxxxxxxxxxxx'}"" cuyo "id = client.id"
            let mensaje = crearMensaje(persona.nombre, data.mensaje); // Almacena en un objeto el nombre y el mensaje que se desea enviar a todos las personas que pertenezcan a la misma sala
            client.broadcast.to(persona.sala).emit('enviarMensaje', mensaje); // Envía un evento "mensaje" a todos los clientes "broadcast" que pertenezcan a la misma sala que la persona mediante el método "to(persona.sala)"
        });
        //----------------------------------------------------------------------------------------------Fin----------------------------------------------------------------------------

        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        // Escucha el evento "mensajePrivado" para enviarlo solo al Socket Cliente cuyo "id" venga en la data
        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        client.on('mensajePrivado', (data) => {
            let persona = usuarios.getPersona(client.id); // Almacena los datos de la persona en un objeto "{ id: 'xxxxxxxxxxxx', nombre: 'xxxxxxxxxxxx'}"
            client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje)); // Con el método "to()" solo se envía el evento al cliente cuyo "id" se use como parámetro en el método "to()". En este caso estamos mandando un evento "emit" a todos "broadcast" los clientes cuyo "id" coincida con el que enviamos como parámetro dentro del método "to(id)", en otras palabras estamos enviando un mensaje privado solo al cliente con ese "id"
        });
        //----------------------------------------------------------------------------------------------Fin------------------------------------------------------------------

        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        // Escucha el evento "disconect" para desconectar a los Sockets Clientes del Socket Servidor
        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        client.on('disconnect', () => { // Con el método "on()" puedo escuchar si el usuario (client) se desconectó. El 1er parámetro tal cual literal 'disconnect' (nombre del evento por defecto) y el 2do es un callback que ejecuta su contenido cuando detecta que el usuario se desconecta
            // console.log('Usuario Desconectado');
            let personaBorrada = usuarios.borrarPersona(client.id); // Almacena en un objeto los datos de la persona borrada del arreglo "personas" (cliente desconectado), "{ id: 'xxxxxxxxxxxx', nombre: 'xxxxxxxxxxxx'}"
            client.broadcast.to(personaBorrada.sala).emit('desconectarPersona', crearMensaje('Administrador', `${personaBorrada.nombre} se desconectó`)); // Evento broadcast para todos los Sockets Clientes que pertenecen a la misma sala, emite el nombre de la persona y el mensaje
            client.broadcast.to(personaBorrada.sala).emit('personas', usuarios.getPersonasPorSala(personaBorrada.sala)); // Evento broadcast para todos los Sockets Clientes que pertenecen a la misma sala, emite un arreglo con todas las personas conectadas al chat
        }); //-------------------------------------Fin evento "disconnect"-----------------------------------------------------------------------------------------------

    }) //-----------------------------------------------------Fin de la conexión del Socket Server con los Sockets Clientes-------------------------------------------------------------------------------------------------------