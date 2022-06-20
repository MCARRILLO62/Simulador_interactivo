let listadoImportaciones = [];
let memoriaListado = [];
let tipoCambio = [];

function IMPORTACION(precio_producto, costo_envio, tax_valorem, tax_IGV, tax_IPM, total) {
    this.precio_producto = precio_producto;
    this.costo_envio = costo_envio;
    this.tax_valorem = tax_valorem;
    this.tax_IGV = tax_IGV;
    this.tax_IPM = tax_IPM;
    this.total = total;
}

function calcular_impuestos() {
    let precio_producto = parseFloat(document.getElementById("cost_product").value);
    let resultado;
    let costo_envio = parseFloat(document.getElementById("cost_shipping").value);
    let tax_valorem;
    let tax_IGV;
    let tax_IPM;

    let valorem;
    let IGV;
    let IPM;
    let total;

    if (isNaN(precio_producto) != true && precio_producto <= 2000 && isNaN(costo_envio) != true) {
        if (precio_producto > 200) {
            tax_valorem = precio_producto * 0.04;
            tax_IGV = (precio_producto + costo_envio) * 0.16;
            tax_IPM = (precio_producto + costo_envio) * 0.02;

            resultado = precio_producto + costo_envio + tax_valorem + tax_IGV + tax_IPM;

        } else {
            tax_valorem = 0;
            tax_IGV = 0;
            tax_IPM = 0;

            resultado = precio_producto + costo_envio + tax_valorem + tax_IGV + tax_IPM;
        }
        valorem = document.getElementById("tax_adValorem");
        valorem.value = tax_valorem.toFixed(2);

        IGV = document.getElementById("tax_IGV");
        IGV.value = tax_IGV.toFixed(2);

        IPM = document.getElementById("tax_IPM");
        IPM.value = tax_IPM.toFixed(2);

        total = document.getElementById("total_cost");
        total.value = resultado.toFixed(2);

        const nuevaImp = new IMPORTACION(precio_producto, costo_envio, parseFloat(tax_valorem.toFixed(2)), parseFloat(tax_IGV.toFixed(2)), parseFloat(tax_IPM.toFixed(2)), parseFloat(resultado.toFixed(2)));

        listadoImportaciones.push(nuevaImp);

        memoriaListado = JSON.stringify(listadoImportaciones);

        localStorage.setItem("listadoMemoria", memoriaListado);

        dibujarListado();


    } else if (precio_producto > 2000) {
        Swal.fire({
            title: '¡Alerta!',
            text: 'El costo del producto no puede ser mayor a US$ 2000 para esta versión. Por favor, revise los datos ingresados.',
            icon: 'info',
            iconColor: 'black',
            backdrop: 'true',
            confirmButtonText: 'OK',
            confirmButtonColor: 'gray',
        })
    } else {
        Swal.fire({
            title: 'Datos incompletos',
            text: 'Por favor, verifica que todos los datos estén completos.',
            icon: 'warning',
            iconColor: 'black',
            backdrop: 'true',
            confirmButtonText: 'OK',
            confirmButtonColor: 'gray',
        })
    }

};

const dibujarListado = () => {

    document.getElementById("listado_imp").innerHTML = "";
    listadoImportaciones.forEach((num, indice) => {

        let nuevoItem = document.createElement("tr");
        nuevoItem.innerHTML = `<th scope="row">${(indice)+1}</th><td>${num.precio_producto}</td><td>${num.costo_envio}</td><td>${num.tax_valorem}</td><td>${num.tax_IGV}</td><td>${num.tax_IPM}</td><td>${num.total}</td><td><button type="button" class="btn btn-dark btn-sm py-0 mb-1" onclick="eliminarItem(${indice})">x</button></td>`

        document.getElementById("listado_imp").appendChild(nuevoItem);
    })
}

const eliminarItem = (indice) =>{
    listadoImportaciones.splice(indice,1);
    document.getElementById("listado_imp").innerHTML = "";
    dibujarListado();
};

let estadoAlt = true;

function mostrarTabla() {
    if (estadoAlt) {
        document.getElementById("calculadora_imp").classList.toggle("ocultar");
        document.getElementById("tabla_imp").classList.toggle("ocultar");

        document.getElementById("calc_tax").setAttribute("disabled", true);
        document.getElementById("mostrar_tabla").value = "Mostrar calculadora";


        estadoAlt = false;
    } else if (estadoAlt == false) {
        document.getElementById("calculadora_imp").classList.toggle("ocultar");
        document.getElementById("tabla_imp").classList.toggle("ocultar");

        document.getElementById("calc_tax").removeAttribute("disabled");
        document.getElementById("mostrar_tabla").value = "Mostrar listado";

        estadoAlt = true;
    }
}

let botonTax = document.getElementById("calc_tax");
botonTax.addEventListener('click', calcular_impuestos);

let botonTabla = document.getElementById("mostrar_tabla");
botonTabla.addEventListener('click', mostrarTabla);

window.onload = () => {
    memoriaListado = localStorage.getItem("listadoMemoria");
    if (typeof (memoriaListado) == "string") {
        memoriaListado = localStorage.getItem("listadoMemoria");
        listadoImportaciones = (JSON.parse(memoriaListado));
        dibujarListado();
    }
}
let textoCambio = document.getElementById('tipo-cambio');

textoCambio.innerHTML = 'Cargando tipo de cambio del día'

const animate_load = () => {
    let counter = 0;
    let intervalo = setInterval(() => {
        textoCambio.innerHTML = textoCambio.innerHTML + '.'
        counter++
        if (counter >= 3){
            clearInterval(intervalo);
        }
    }, 1000);
};

animate_load();

// Fetch API Sunat tipo de cambio: soles a dólares americanos.

fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.apis.net.pe/v1/tipo-cambio-sunat')}`)
    .then(response => {
        if (response.ok) return response.json()
        throw new Error('Hubo un error.')
    })
    .then(data => tipoCambio = JSON.parse(data.contents));


setTimeout(() => {
    textoCambio.innerHTML = `Tipo de cambio $ || Compra: <strong>S/ ${tipoCambio.compra}</strong> | Venta: <strong>S/ ${tipoCambio.venta}</strong> ||  ${tipoCambio.origen} - ${tipoCambio.fecha}`
}, 4000);