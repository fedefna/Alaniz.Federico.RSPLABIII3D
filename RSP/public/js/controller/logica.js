
import Anuncio_Mascota from '../entidades/anuncioMascota.js';
import {
    crearTabla,
    idSeleccionado,
    limpiar
} from '../entidades/tabla.js';

const URL = "http://localhost:3000/mascotas";
const spinner = document.getElementById("spinner");
const divTabla = document.getElementById("divTabla");

export function crearSpinner() {
    while (divTabla.firstChild) {
        divTabla.removeChild(divTabla.lastChild);
    }
    const img = document.createElement('img');
    img.setAttribute("src", "./images/dog.gif");
    img.setAttribute("alt", "Imagen Spinner");
    return img;
}

export function obtenerMascotas() {
    return new Promise((resolve, reject) => {

        spinner.appendChild(crearSpinner());

        const xhr = new XMLHttpRequest();

        let datos;

        xhr.addEventListener('readystatechange', () => {

            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {

                    datos = JSON.parse(xhr.responseText);
                    const mascotas = [];

                    datos.forEach(element => {
                        const mascota = new Anuncio_Mascota(
                            element.id,
                            element.titulo,
                            element.descripcion,
                            element.precio,
                            element.correa,
                            element.bozal,
                            element.animal,
                            element.raza,
                            element.fecha,
                            element.vacuna
                        );
                        mascotas.push(mascota);
                    });

                    resolve(mascotas);

                } else {
                    //error
                    let mensaje = xhr.statusText || "Se produjo un ERROR";
                    reject({ status: xhr.status, statusText: mensaje });
                }
                spinner.innerHTML = "";
            }
        });
        xhr.open('GET', URL);

        xhr.send();
    })
}

export function altaMascota(frm) {
    //asigno lo ingresado en el form

    let correacheckeada = document.getElementById('cbCorrea').checked;
    let bozalCheckeado = document.getElementById('cbBozal').checked;

    const nuevaMascota = new Anuncio_Mascota(
        frm.id.value,
        frm.titulo.value,
        frm.descripcion.value,
        frm.precio.value,
        bozalCheckeado,
        correacheckeada,
        frm.animal.value,
        frm.raza.value,
        frm.fecha.value,
        frm.vacuna.value
    )

    const config = {
        method: 'POST',
        headers: {
            "Content-type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(nuevaMascota)
    }
    spinner.appendChild(crearSpinner());
    //al fetch le paso la url con el obj config(lleva nuevamascota dentro del body)
    return fetch(URL, config)
        .then((response) => {
            if (!response.ok) throw { status: response.status, statusText: response.statusText || "No definido" }; //retorna una promesa fallida
            return response.json(); //devuelve una promesa que es no bloqueante
        })
        .then((mascotaAgregada) => {
            console.log("Se dio de alta: ", mascotaAgregada);
            return true;
        })
        .catch((err) => {
            console.error(`Error ${err.status} ${err.statusText}`);
        })
        .finally(() => {
            spinner.innerHTML = "";
        })
}

export function actualizarLista(listaMascotas) {
    cargarMaximo(listaMascotas);
    cargarMinimo(listaMascotas);
    cargarAnimalesVacunados(listaMascotas);
    cargarDatos(listaMascotas);

    while (divTabla.firstChild) {
        divTabla.removeChild(divTabla.lastChild);
    }
    divTabla.appendChild(crearTabla(listaMascotas));
}


export async function buscarMascota(id) {

    let lista = await obtenerMascotas();
    lista.forEach(element => {
        if (element['id'] == id) {
            let frm = document.forms[0];
            frm.titulo.value = element['titulo'],
                frm.descripcion.value = element['descripcion'],
                frm.precio.value = element['precio'],
                frm.animal.value = element['animal'],
                frm.raza.value = element['raza'],
                frm.fecha.value = element['fecha'],
                frm.vacuna.value = element['vacuna']
            if (element['correa']) {
                frm.cbCorrea.checked = true;
            }
            if (element['bozal']) {
                frm.cbBozal.checked = true;
            }
        }
    });
}

export function ocultarBotones() {
    const btns = document.getElementsByTagName('button');

    for (let index = 0; index < btns.length; index++) {
        btns[index].classList.toggle('ocultarBtn');
    }
}

export function bajaMascota(id) {

    try {
        return new Promise(async (resolve, reject) => {
            spinner.appendChild(crearSpinner());
            const xhr = new XMLHttpRequest();

            xhr.addEventListener('readystatechange', () => {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(true);
                    } else {
                        let mensaje = xhr.statusText || 'Se produjo un ERROR';
                        reject({ status: xhr.status, statusText: mensaje });
                    }
                }
                spinner.innerHTML = "";
            });

            xhr.open('DELETE', `${URL}/${id}`);
            xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
            xhr.send();
        });
    } catch (err) {
        throw { status: err.status, statusText: err.statusText };
    }

}

export function modificarMascota(mascota) {
    /* let id = mascota.id;
    mascota.precio = parseInt(mascota.precio);
    delete mascota.id; */
    console.log("Entre a modificar mascota y el idSeleccionado es: " + idSeleccionado);
    const config = {
        method: 'PUT',
        headers: {
            "Content-type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(mascota)
    }
    spinner.appendChild(crearSpinner());
    fetch(`${URL}/${idSeleccionado}`, config) //PUT con configuracion y datos
        .then((response) => {
            if (!response.ok) throw { status: response.status, statusText: response.statusText || "No definido" };
            return response.json(); //devuelve una promesa que es no bloqueante
        })
        .then(mascotaEditada => {
            console.log("ENTRE A MODIFICAR ", mascotaEditada);
            return mascotaEditada;
        })
        .catch((err) => {
            console.error(`Error ${err.status} ${err.statusText}`);
        })
        .finally(() => {
            spinner.innerHTML = "";
        })

}

export function promedio(filtro, lista) {

    let media;

    if (filtro != "todos") {

        const listaFiltrada = lista.filter(mascota => mascota.animal == filtro);
        console.log(listaFiltrada);

        const suma = listaFiltrada.reduce((previo, actual) => {
            return previo + parseInt(actual.precio);
        }, 0);

        console.log(suma);

        media = suma / listaFiltrada.length;

        actualizarLista(listaFiltrada);
    } else {
        const suma = lista.reduce((previo, actual) => {
            return previo + parseInt(actual.precio);
        }, 0);

        media = suma / lista.length;

        actualizarLista(lista);
    }
    return media;
}


export function cargarMaximo(lista) {

    let mayor = lista.reduce((prev, actual) => {
        return parseInt(prev.precio) > parseInt(actual.precio) ? prev : actual;
    })
    document.getElementById("txtMax").value = mayor.precio;
}

export function cargarMinimo(lista) {

    let menor = lista.reduce((prev, actual) => {
        return parseInt(prev.precio) < parseInt(actual.precio) ? prev : actual;
    })
    document.getElementById("txtMin").value = menor.precio;

}

export function cargarAnimalesVacunados(lista) {
    let totalAnimales = lista.length

    let vacunados = lista.filter((elemento) => {
        return elemento.vacuna === "si";
    })

    let porcentaje = (vacunados.length * 100) / totalAnimales;


    document.getElementById("txtAnimalesVacunados").value = porcentaje;
}


export function agregarGrafico() {

    console.log(localStorage.getItem("anunciosMasVisitados"));
    let anunciosMasVisitados = JSON.parse(localStorage.getItem("anunciosMasVisitados"));

    let miset = new Set(anunciosMasVisitados);
    let arraySinRepetir = [];
    miset.forEach(element => {
        arraySinRepetir.push(element);
    });

    let cantidades=[];
    
    arraySinRepetir.forEach(element => {
        let aux=0;
        anunciosMasVisitados.forEach(el => {
            if (element==el) {
                aux++;
            }
        });
        cantidades.push(aux);
    });
    

    let grafico = document.getElementById("grafico").getContext('2d');
    let chart = new Chart(grafico, {
        type: 'bar',
        data: {
            labels: arraySinRepetir,
            datasets: [{
                label: 'Visitas',
                data: cantidades,
                backgroundColor:'red'
            }
            ]
        },
        options: {}
    });
}

export function cargarDatos(lista) {
    lista.reverse();
    let aux;
    for (let index = 0; index < 3; index++) {
        aux=lista[index].fechaCreacion;
            document.getElementById("id1").value = lista[index].id;
            document.getElementById("fechaDeCarga1").value = aux;
        if(index==1){
            document.getElementById("id2").value = lista[index].id;
            document.getElementById("fechaDeCarga2").value = aux;
        }
        if(index==2){
            document.getElementById("id3").value = lista[index].id;
            document.getElementById("fechaDeCarga3").value = aux;
        }
    }
}