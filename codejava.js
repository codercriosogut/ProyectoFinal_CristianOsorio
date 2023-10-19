//ventas
class Item {
    constructor(item) {
        this.nombre = item.nombre;
        this.precio = item.precio;
        this.descripcion = item.descripcion;
    }
    assemble() {
        console.log(this.nombre)
        return `<div class="card-header py-3">
        <h4 class="my-0 fw-normal">${this.nombre}</h4>
    </div>
    <div class="card-body">
        <h1 class="card-title pricing-card-title">$${this.precio}</h1>
        <p>${this.descripcion}</p>
        <div class="button-container">
            <button nombre="button" id="eventoCompra" class="btn btn-lg btn-outline-success" onclick="compraProduc('${this.nombre}', '${this.precio}', '${this.descripcion}')">Comprar</button>
            <button nombre="button" id="eventoQuitar" class="btn btn-lg btn-outline-danger" onclick="quitarProducto('${this.nombre}')">Quitar</button>
        </div>
    </div>`;
    }
}
//datos de la compra
let mensaje = document.getElementById("mensaje");
//formulario
let FormProduc = document.getElementById("FormProduc");
//Seccion de todos los productos
let totalProduc = document.getElementById("totalProduc");
FormProduc.addEventListener("submit", crearProduc);
//Variable Global
let listaProduc;
let stotageList;
listaProduc = JSON.parse(localStorage.getItem("listaProduc")) || [];
const cards = document.getElementById("cards");
const checkoutButton = document.getElementById("checkoutButton");
//funcion
function compraProduc(nombre, precio, descripcion) {
    const cartItem = document.createElement("li");
    cartItem.innerHTML = `${nombre} - $${precio}`;
    cards.appendChild(cartItem);
    //guardar informacion a la estructura de datos
    const comprasUsers = JSON.parse(localStorage.getItem("comprasUsers")) || [];
    comprasUsers.push({ nombre, precio });
    localStorage.setItem("comprasUsers", JSON.stringify(comprasUsers));
    mensaje.append(messageBody);
    mensaje.className = "alert alert-success visible";
}

//ARREGLADO
checkoutButton.addEventListener("click", () => {
    //proceso del pedido
    //acceso a los elementos del carrito desde localStorage
    const comprasUsers = JSON.parse(localStorage.getItem("comprasUsers")) || [];
    if (comprasUsers.length === 0) {
        //alert sweetalert ("El carrito está vacío. Agrega planes antes de realizar el pedido.");
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'El carrito esta vacío!',
            footer: '<a>Favor agrega nuevos productos al carro de compras.</a>'
        })
    } else {
        //limpiar carrito despues de la compra
        localStorage.removeItem("comprasUsers");
        cards.innerHTML = "";
        //alerta sweetalert pedido realizado
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'El pedido se ha realizado con éxito!',
            showConfirmButton: false,
            timer: 3000
        })
    }
});

//quitar productos
function quitarProducto(nombre) {
    const comprasUsers = JSON.parse(localStorage.getItem("comprasUsers")) || [];
    const index = comprasUsers.findIndex(item => item.nombre === nombre);
    if (index !== -1) {
        comprasUsers.splice(index, 1);
        localStorage.setItem("comprasUsers", JSON.stringify(comprasUsers));
        // Actualiza la visualización del carrito
        const cartItems = document.querySelectorAll("#cards li");
        cartItems[index].remove();
    }
}

//funcion ver productos
const verProductos = () => {
    let stotaged = listaProduc;
    stotageList = [];
    totalProduc.innerHTML = "";
    for (const objeto of stotaged) {
        console.log(objeto);
        stotageList.push(new Item(objeto));
    }
    console.log(stotageList);
    for (const item of stotageList) {
        let firstDiv = document.createElement("div");
        firstDiv.className = "col";
        let secondDiv = document.createElement("div");
        secondDiv.className = "card mb-4 rounded-3 shadow-sm";
        secondDiv.innerHTML = item.assemble();
        firstDiv.append(secondDiv);
        totalProduc.append(firstDiv)
    }
}
//agrega nuevo item al storage
/**
*@param {Object} item 
*/

const nuevoProduc = (item) => {
    //console.log(item)
    listaProduc.push(item);
    //console.log(listaProduc)
    localStorage.setItem("listaProduc", JSON.stringify(listaProduc));
    verProductos();
    //borrar contenido al agregar nuevo producto al inventario
    tipoProduc.value = "";
    tipoPrecio.value = "";
    tipoDescripcion.value = "";
    //Mensaje producto guardado
    //Se borran datos en los campos de textos
    Swal.fire({
        title: '¡Producto guardado con Éxito!',
        text: 'Los campos llenos se borrarán',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
}

/**
 * Recibe los datos del formulario para la creación 
 * del nuevo Item.
 * @param {Object} e 
 */

function crearProduc(e) {
    //Inputs
    let tipoProduc = document.getElementById("tipoProduc").value;
    let tipoPrecio = document.getElementById("tipoPrecio").value;
    let tipoDescripcion = document.getElementById("tipoDescripcion").value;
    e.preventDefault();
    let item = {
        nombre: tipoProduc,
        precio: tipoPrecio,
        descripcion: tipoDescripcion
    }
    nuevoProduc(item);
}
//
//
//cargar pagina web reload
function clearLocalStorage() {
    localStorage.clear();
    totalProduc.innerHTML = "";
    location.reload();
    //borrar base de datos completamente
    alert("El contenido de la base de datos se a eliminado por completo.");
}
//llamar la funcion
document.getElementById("clearLocalStorageButton").addEventListener("click", clearLocalStorage);
verProductos();
//
//login
//
function cargarUsuario() {
    let username = document.getElementById("user");
    let userResult = localStorage.getItem('username');
    let contenidoPrivado = document.getElementById("contenido-privado");
    if (userResult) {
        username.innerHTML = `Usuario Logeado: <b>${userResult}</b> `;
        contenidoPrivado.style.display = "block";
    }
}
window.addEventListener('load', cargarUsuario);
document.getElementById("login").addEventListener("click", function () {
    let username = document.getElementById("user");
    let userResult = localStorage.getItem('username');
    let contenidoPrivado = document.getElementById("contenido-privado");
    if (!userResult) {
        Swal.fire({
            title: 'Iniciar Sesión',
            html: `<input type="text" id="login" class="swal2-input" placeholder="Nombre de Usuario">
          <input type="password" id="password" class="swal2-input" placeholder="Contraseña">`,
            confirmButtonText: 'Acceso',
            focusConfirm: false,
            preConfirm: () => {
                const login = Swal.getPopup().querySelector('#login').value
                const password = Swal.getPopup().querySelector('#password').value
                if (!login || !password) {
                    Swal.showValidationMessage(`Please enter login and password`)
                }
                return { login: login, password: password }
            }
        }).then((result) => {
            localStorage.setItem('username', result.value.login)
            username.innerHTML = `Usuario Logeado: <b>${result.value.login}</b> `;
            contenidoPrivado.style.display = "block";
        })
    } else {
        username.innerHTML = `Usuario Logeado:<b>${userResult}</b> `;
        contenidoPrivado.style.display = "block";
    }
});
document.getElementById("logout").addEventListener("click", function () {
    let username = document.getElementById("user");
    let contenidoPrivado = document.getElementById("contenido-privado");
    localStorage.removeItem('username');
    username.innerHTML = '';
    contenidoPrivado.style.display = "none";
    Swal.fire({
        title: 'Logout Exitoso',
        text: 'Has cerrado sesión con éxito.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
});
//
//API+Key+Toastify-Mensaje
//<!-- https://v6.exchangerate-api.com/v6/e01625dd4bc23579292cebfe/latest/USD -->
//key valido por 2 semanas 18/10 al 1/11
//
const apiUrl = 'https://v6.exchangerate-api.com/v6/e01625dd4bc23579292cebfe/latest/USD';
const tipoDeCambio = document.getElementById('tipoDeCambio');
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const rates = data.conversion_rates;
        const mensajeApi = `Tipo de Cambio
            1 USD=>CLP: ${rates.CLP}
            1 EUR=>CLP: ${rates.EUR}
            1 CNY=>CLP: ${rates.CNY}          
        `;

        Toastify({
            text: mensajeApi,
            duration: -1,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                marginTop: "25px",
                padding: "10px",
            },
        }).showToast();
    })
    .catch(error => {
        Toastify({
            text: 'Error al cargar los datos API_Tipo_Cambio',
            duration: -1,
            backgroundColor: "red",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                marginTop: "25px",
                padding: "10px",
            },
            
            
        }).showToast();
        console.error('Error:', error);
    });


