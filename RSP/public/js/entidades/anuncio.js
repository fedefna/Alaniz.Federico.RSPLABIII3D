

export default class Anuncio{
    constructor(id,titulo,descripcion,precio){
        this.id = id;
        this.titulo = titulo;
        this.transaccion = "ventas";
        this.descripcion = descripcion;
        this.precio = precio;
    }

    //Geters y seters
    set Titulo(titulo){          
        this.titulo = titulo;
    }
    get Titulo(){       
        return this.titulo;
    }
    set Descripcion(descripcion){  
        this.descripcion = descripcion;
    }
    get Descripcion(){       
        return this.descripcion;
    }

}