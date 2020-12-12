
import Anuncio from './anuncio.js';

export default class Anuncio_Mascota extends Anuncio{
    constructor(id,titulo,descripcion,precio,correa,bozal,animal,raza,fecha,vacuna){
        let date =new Date();
        let dia=date.getDate();
        let mes=date.getMonth();
        mes++;
        let year=date.getFullYear();
        super(id, titulo, descripcion, precio);
        this.correa = correa;
        this.bozal = bozal;
        this.animal = animal;
        this.raza = raza;
        this.fecha = fecha;
        this.vacuna = vacuna;
        this.fechaCreacion=dia+"/"+mes+"/"+year;
    }

    //Geters y seters
    set Correa(correa){          
        this.correa = correa;
    }
    get Correa(){       
        return this.correa;
    }
    set Bozal(bozal){          
        this.bozal = bozal;
    }
    get Bozal(){       
        return this.bozal;
    }
    set Animal(animal){          
        this.animal = animal;
    }
    get Animal(){       
        return this.animal;
    }
    set Raza(raza){          
        this.raza = raza;
    }
    get Raza(){       
        return this.raza;
    }

    set Fecha(fecha){          
        this.fecha = fecha;
    }
    get Fecha(){       
        return this.fecha;
    }

    set Vacuna(vacuna){          
        this.vacuna = vacuna;
    }
    get Vacuna(){       
        return this.vacuna;
    }

}