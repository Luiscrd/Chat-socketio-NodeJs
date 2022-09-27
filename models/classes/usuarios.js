class Usuarios {

    constructor() {

        this.pesrsonas = [];

    }

    agregarPersona(id , nombre) {

        let persona = { id, nombre };

        this.pesrsonas.push( persona );

        return this.pesrsonas;

    }

    getPersona(id) {

        let persona = this.pesrsonas.filter( persona => {
            return persona.id === id
        })[0]

        return persona;

    }

    getPersonas() {

         return this.pesrsonas;

    }

    getPersonaPorSala(sala) {

        

    }

    borrarPersona(id){

        let personaBorrada = this.getPersona(id);

        let personas = this.pesrsonas.filter( persona => {
            return persona.id != id
        })

        return personaBorrada

    }


};


module.exports = Usuarios;