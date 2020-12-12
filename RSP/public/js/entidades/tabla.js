
import {
    buscarMascota,
    ocultarBotones
} from '../controller/logica.js';

export let idSeleccionado;

export function crearTabla(lista){

    const tabla = document.createElement('table');
    tabla.appendChild(crearCabecera(lista[0]));
    tabla.appendChild(crearCuerpo(lista));
    
    return tabla;
}

function crearCabecera(item){

    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    for (const key in item) {
        const th = document.createElement('th');
        const titulo = document.createTextNode(key);
        th.appendChild(titulo);
        tr.appendChild(th);
    }

    thead.appendChild(tr);

    return thead;
}

function crearCuerpo(lista){
    const tbody = document.createElement('tbody');

    lista.forEach(element => {
        const tr = document.createElement('tr');

        for (const key in element) {
            const td = document.createElement('td');
            const texto = document.createTextNode(element[key]);

            td.appendChild(texto);

            tr.appendChild(td);
        }
        if(element.hasOwnProperty('id')){
            tr.setAttribute('data-id', element['id']);
        }
        
        agregarManejadorTR(tr);
        tbody.appendChild(tr);
    });

    return tbody;
}

let flag = false;
function agregarManejadorTR(tr){
    if(tr){
        tr.addEventListener('click', function(e){

        // ocultar boton agregar y mostrar el resto
        if(!flag){
            ocultarBotones();
            flag = true;
        }

        //busco por id
        idSeleccionado = e.target.parentNode.getAttribute('data-id');

        buscarMascota(e.target.parentNode.getAttribute('data-id'));

        })
    }
}


export function limpiar(){
    //ocultarBotones();
    let frm = document.forms[0];
        frm.titulo.value = "";
        frm.descripcion.value = "";
        frm.precio.value = "";
        frm.animal.value = "";
        frm.cbCorrea.checked=false;
        frm.cbBozal.checked=false;
        frm.raza.value = "";
        frm.fecha.value = "";
    flag = false;
}
