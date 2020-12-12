
import {
    obtenerMascotas,
    actualizarLista,
    bajaMascota,
    modificarMascota,
    altaMascota,
    promedio,
    ocultarBotones,
    agregarGrafico,
    cargarDatos
} from './controller/logica.js';

import {
    limpiar,
    idSeleccionado
} from './entidades/tabla.js';


let frm;
let listaMascotas;
let btnCancelar;
let btnDelete;
let btnEdit;
////////////
let frm2;
let inputPromedio;
let filtro;
let divTabla;
//let maximo;

window.addEventListener('load', inicializarManejadores);

//maximo = document.getElementById('txtMax');
async function inicializarManejadores() {
    let array=[1,2,3,1,2,1,1,1,4,5,5,4,4];
    localStorage.setItem("anunciosMasVisitados",JSON.stringify(array));
    listaMascotas = await obtenerMascotas();
    divTabla = document.getElementById('divTabla');
    actualizarLista(listaMascotas);

    agregarFiltros(listaMascotas[0]);
    agregarGrafico();
    
    
    frm = document.forms[0];
    frm.addEventListener('submit', async (e) => {
        e.preventDefault();

        //creo anuncio mascota
        await altaMascota(frm);
        listaMascotas = await obtenerMascotas();
        actualizarLista(listaMascotas);
        limpiar();
        alert('Anuncio Creado.');
    });

    frm2 = document.forms[1];

}


btnCancelar = document.getElementById('btnCancel');
btnCancelar.addEventListener('click', e => {
    e.preventDefault();
    ocultarBotones();
    limpiar();
})

btnDelete = document.getElementById('btnDelete');
btnDelete.addEventListener('click', async (e) => {
    e.preventDefault();
    //Eliminar y actualizar

    await bajaMascota(idSeleccionado);

    listaMascotas = await obtenerMascotas();
    actualizarLista(listaMascotas);
    ocultarBotones();
    limpiar();
    alert('Anuncio eliminado.');
})

btnEdit = document.getElementById('btnEdit');
btnEdit.addEventListener('click', async (e) => {
    e.preventDefault();
    //Eliminar de la lista y actualizar
    // console.log(idSeleccionado);

    let mascotaModificada = listaMascotas.find(element => element['id'] == idSeleccionado);

    console.log(mascotaModificada);
    let correacheckeada = document.getElementById('cbCorrea').checked;
    let bozalCheckeado = document.getElementById('cbBozal').checked;

    mascotaModificada.titulo = frm.titulo.value;
    mascotaModificada.descripcion = frm.descripcion.value;
    mascotaModificada.precio = frm.precio.value;
    mascotaModificada.correa = correacheckeada;
    mascotaModificada.bozal = bozalCheckeado;
    mascotaModificada.animal = frm.animal.value;
    mascotaModificada.raza = frm.raza.value;
    mascotaModificada.fecha = frm.fecha.value;
    mascotaModificada.vacuna = frm.vacuna.value;



    await modificarMascota(mascotaModificada);

    listaMascotas = await obtenerMascotas();
    actualizarLista(listaMascotas);
    ocultarBotones();
    limpiar();

    alert('Anuncio Modificado.');
})

inputPromedio = document.getElementById('promedio');
filtro = document.getElementById('filtro');
filtro.addEventListener('change', async (e) => {
    e.preventDefault();

    console.log(frm2.filtrar.value);

    let media = promedio(frm2.filtrar.value, listaMascotas);

    console.log(media);
    inputPromedio.value = media;
});

function agregarFiltros(item) { // creo el thead y lo meto al div

    const menu = document.getElementById('menuFiltros');
    let checked = JSON.parse(localStorage.getItem("anuncios"));


    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    tr.classList.add('menuFiltros');

    for (const key in item) {
        let th = document.createElement('th');
        let texto = document.createTextNode(key);
        let checkbox = document.createElement('input');

        checkbox.type = "checkbox";
        checkbox.name = key;
        checkbox.value = key;
        checkbox.id = "CB" + key;

        let flag=false;

        checked.forEach(element => {
            if (element == checkbox.name) {
                flag=true;
            } 
        });
        checkbox.checked = flag;


        checkbox.addEventListener('change', manejadorCheckBox);

        checkbox.classList.add('checkboxMargin');
        th.appendChild(texto);
        th.appendChild(checkbox);

        tr.appendChild(th);

    }


    thead.appendChild(tr);
    thead.classList.add('text-capitalize');
    menu.appendChild(thead);
    manejadorCheckBox();

}


function manejadorCheckBox() {

    let allChecks = document.querySelectorAll(".checkboxMargin");


    obtenerMascotas()
        .then(function (res) {

            let array = res;
            let arrayItemsChecked = [];
            let arrayFiltrado = array.map(function (item) {
                allChecks.forEach(element => {
                    if (!element.checked) {

                        delete item[element.value];

                    }
                });
                return item;
            });

            allChecks.forEach(element => {
                if (element.checked) {

                    arrayItemsChecked.push(element.value);

                }
            });

            localStorage.setItem("anuncios", JSON.stringify(arrayItemsChecked));
            
            actualizarLista(arrayFiltrado);
        });


}