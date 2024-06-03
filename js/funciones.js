window.addEventListener('load',inicio);

let sistema = new Sistema(); //Creamos el sistema con sus objetos.

function get (id) {
    return document.querySelector('#'+id); // Agarramos el ID del elemento.
}

function inicio () {
    get('btnLogin').addEventListener('click',login);
    get('btnRegistrar').addEventListener('click',registroCliente);
    get('btnSalirCliente').addEventListener('click',logout);
    get('btnSalirAdmin').addEventListener('click',logout);    
    get('elegirProducto').addEventListener('change',actualizarProducto);
}

// FUNCIONES GENERICAS
function mostrar (id) {
    get(id).style.display = 'block';
}
function ocultar (id) {
    get(id).style.display = 'none';
}
function mostrarSeccion(id) { //Muestra unicamente una seccion y oculta el resto.
    ocultar('sectionCliente');
    ocultar('sectionAdministrador');
    ocultar('loginApp');
    mostrar(id);
}


// FUNCIONES GENERICAS


// FUNCIONES LOGIN Y REGISTRO con sus validaciones

function login(){ //Ingresa a la aplicacion si cumple con los requisitos.
    let user = get('userLogin').value;
    let pass = get('passLogin').value;
    if (user == '' || pass == '') {
        alert('Los campos son obligatorios');
    } else if(sistema.esAdmin(user,pass)){
        mostrarSeccion('sectionAdministrador')
        get('loginForm').reset();
        sistema.usuarioLogueado=true;
    } else if(sistema.esCliente(user,pass)){
        mostrarSeccion('sectionCliente')
        cargarProductos();
        get('loginForm').reset();

        sistema.usuarioLogueado=true;
    } else {
        alert('Datos incorrectos');
    }
}

function passValida (password) {
    let esValida = null;
    let cantMayus = 0;
    let cantMinus = 0;
    let cantNum = 0;
    
    //String 5 caracteres, al menos una mayus, una minus y un numero.
    if(password === '' || password.length < 4) {
        esValida = false
    }else {
        for(let i =0; i < password.length; i++) {
            let codigo = password.charCodeAt(i) ;
            if(codigo >= 48 && codigo <= 57) {
                cantNum++;
            }else if (codigo >= 65 && codigo <=90) {
                cantMayus++;
            }else if(codigo >=97 && codigo <=122) {
                cantMinus++;
            }
        }
    } 
    if(cantMayus >= 1 && cantMinus >= 1 && cantNum >=1) {
        esValida = true;
        console.log(esValida);
    } 
    return esValida;
}


function tarjetaValida (numero) { 
    let numeros= '0123456789-';
    let esValida = false;
    if(numero.length == 19) { // Primero comprueba si la cantidad de numeros con los guiones inlcuidos son igual a 19
        for(let i = 0; i< numero.length; i++) {
            let posicionActual = numero.charAt(i);
            if(numero.charAt(4) === '-' && numero.charAt(9)== '-' && numero.charAt (14) == '-') { //Comprueba si es correcta la posicion de los guiones en el numero de la tarjeta.
                if(numeros.includes(posicionActual)) { //Comprobamos si los numeros estan inlcuidos en la variable numeros.
                    esValida = true;
                }
            }
        }
    }
    return esValida;
}
function registroCliente () {
    let nombreCliente = get('nombrePersona').value;
    let apellidoCliente = get('apellidoPersona').value;
    let usernameCliente = get('nombreUsuario').value.toLowerCase();
    let passCliente = get('passUsuario').value;
    let tarjeta = get('tarjeta').value;
    let cvc = parseInt(get('cvc').value);
    let estado = 'pendiente';

    if(nombreCliente === ''|| apellidoCliente === '' || usernameCliente === ''||passCliente === ''|| tarjeta === ''|| cvc === '' ){
        alert('Todos los campos son obligatorios');
    }else if(!passValida(passCliente) || sistema.esCliente(usernameCliente) || sistema.esAdmin(usernameCliente) || isNaN(cvc) || cvc.length < 3||!tarjetaValida(tarjeta)) {
        alert('Datos incorrectos');
    }else {
        let nuevoCliente = new Cliente (nombreCliente,apellidoCliente,usernameCliente,passCliente,tarjeta,cvc,estado);
        sistema.listaClientes.push(nuevoCliente);
        alert('usuario creado');
    }
}


// FUNCIONES LOGIN Y REGISTRO con sus validaciones



function logout() {
    mostrarSeccion('loginApp')
    sistema.usuarioLogueado= null
}




// function algoritmoLuhn(numero) {
//     let suma = 0;
//     let digitoVerificadorX = Number(numero.charAt(numero.length - 1));
//     let contador = 0;
//     let i = numero.length - 2;
//     let hayNumero = true;

//     while (i >= 0 && hayNumero) {
//         let caracter = numero.charAt(i);
//         if (!isNaN(caracter)) {
//             let num = Number(caracter);
//             if (contador % 2 === 0) {
//                 num = duplicarPar(num);
//             }
//             suma = suma + num;
//         } else {
//             hayNumero = false;
//         }
//         i--;
//         contador++;
//     }

//     let digitoVerificadorValido = checkDigito(suma, digitoVerificadorX);
//     let moduloDeLaSumaValidado = checkModulo(suma, digitoVerificadorX);
//     return digitoVerificadorValido && moduloDeLaSumaValidado;
// }

// function tarjetaValida(numero){
// }



// COMPRA DE PRODUCTOS

// function cargarTabla() {
//     let texto = '';
//     let listaProds = sistema.listaProductos;
//     for(let i = 0; i< listaProds.length; i++) {
//         let productoActual = listaProds[i];
//         texto += `
//             <tr>
//                 <td>${productoActual.nombre}</td>
//                 <td>${productoActual.descripcion}</td>
//                 <td>${productoActual.precio}</td>
//                 <td><img src='${productoActual.url}'></td>
//                 <td><input type='number' id='cantUnidades'></td>
//                 <td><input type='button' value='Comprar' id='btnComprarProd${productoActual.id}'></td>
//             </tr>
//         `
//     }
//     get('tablaProductosDisponibles').innerHTML = texto;
// } 


function cargarProductos() {
    let texto = '';
    let listaProds = sistema.listaProductos;
    for(let i =0; i< listaProds.length; i++) {
        let prodActual = listaProds[i];
        texto += `
            <option>${prodActual.nombre}</option>
        `
    }
    get('elegirProducto').innerHTML = texto
}

function seleccionarProducto() {

    let articulo = '';
    let nombreProducto = get('elegirProducto').value;
    let objProducto = sistema.obtenerProducto(nombreProducto)
    if(objProducto) {
        articulo += `
        <img src='${objProducto.url}'>
        <p>${objProducto.nombre}</p>
        <p>${objProducto.descripcion}</p>
        <p>$${objProducto.precio}</p>
        <input type='number' placeholder='Cantidad' id='cantidadUnidades'>
        <input type='button' value='Comprar' id='btnComprar'>
    `
    }
    get('articuloProducto').innerHTML = articulo
}


function actualizarProducto() {
    let nombreProd = get('elegirProducto').value;
    let objProducto = sistema.obtenerProducto(nombreProd)
    seleccionarProducto()
}
// COMPRA DE PRODUCTOS