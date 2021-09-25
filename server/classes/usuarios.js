class Usuarios {

    constructor() {
        this.personas = []; // Almacena personas en un arreglo
    };

    agregarPersona(id, nombre, sala) { // Agregar una persona con el id, el nombre y la sala pasados por parámetro en el arreglo "this.personas"
        let persona = { id, nombre, sala }; // Almacena los datos de una persona en este caso esto "{ id, nombre, sala }" es lo mismo que "{ id: id, nombre: nombre, sala: sala }"
        this.personas.push(persona); // Agrega la persona dentro del arreglo de personas declarado en el constructor
        return this.personas; // Retorna el arreglo con todas las personas
    };

    getPersona(id) { // obtiene la 1ra persona dentro del arreglo "this.personas" cuyo id coincida con el id pasado por parámetro. Devuelve un objeto con el "id", el "nombre" de la persona y la sala "{ id: 'xxxxxxxxxxxx', nombre: 'xxxxxxxxxxxx', sala: 'xxxxxxx' }"
        let persona = this.personas.filter(pers => pers.id === id)[0]; // El método "filter()" devuelve un arreglo con las personas cuyo id coincida con el id pasado por parámetro. en este caso solo quiero la 1ra persona dentro del arreglo devuelto por el método "filter()" por eso uso "[0]"
        return persona; // Devuelve una persona en un objeto "{ id: 'xxxxxxxxxxxx', nombre: 'xxxxxxxxxxxx', sala: 'xxxxxxx' }"
    };

    getPersonas() { // Devuelve un arreglo con personas
        return this.personas;
    };

    getPersonasPorSala(sala) {
        let personasPorSala = this.personas.filter(pers => pers.sala === sala);
        return personasPorSala; // retorna en un arreglo de todas las personas que pertenecen a la misma sala
    };

    borrarPersona(id) { // Elimina una persoana del arreglo "this.personas" cuyo id coincida con el id pasado por parámetro
        let personaBorrada = this.getPersona(id); // Almacena la persona que va a ser eliminada (persona sacada del arreglo) antes que sea sacada del arreglo la obtengo con el método "getPersona()" que me retornará en un objeto esa persona "{ id: 'xxxxxxxxxxxx', nombre: 'xxxxxxxxxxxx'}"
        this.personas = this.personas.filter(persona => persona.id !== id); // El método "filter()" devolverá en un arreglo todas las personas cuyo id no coincida con el id pasado por parámetro. En otras palabras eliminará del arreglo "this.personas" a la persona cuyo id coincida con el id pasado por parámetro
        return personaBorrada; // Retorna la persona eliminada en un objeto "{ id: 'xxxxxxxxxxxx', nombre: 'xxxxxxxxxxxx', sala: 'xxxxxxx' }"
    };
};

module.exports = { Usuarios }; // Exporta la clase Usuarios para que pueda ser empleada por otros archivos de la aplicación