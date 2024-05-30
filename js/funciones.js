window.addEventListener('load',inicio);

let sistema = new Sistema(); //Creamos el sistema con sus objetos.

function get (id) {
    return document.querySelector('#'+id); // Agarramos el ID del elemento.
}

function inicio () {
    get('btnLogin').addEventListener('click',login);
    get('btnRegistrar').addEventListener('click',registroCliente);

}

// FUNCIONES GENERICAS
function mostrar (id) {
    get(id).style.display = 'block';
}
function ocultar (id) {
    get(id).style.display = 'none';
}
function mostrarSeccion(id) { //Muestra unicamente una seccion y oculta el resto.
    ocultar('registroApp');
    ocultar('sectionCliente');
    ocultar('sectionAdministrador');
    ocultar('loginApp');
    mostrar(id);
}

function esAdmin (username,pass) { //Comprueba si el usuario es admin
    let existeAdmin = false
    for(let i = 0; i < sistema.listaAdmins.length;i++) {
        let adminActual = sistema.listaAdmins[i];
        if(adminActual.username.toLowerCase() === username.toLowerCase() && adminActual.password === pass) {
            alert('admin')
            existeAdmin = true
        }
    }
    return existeAdmin;
}

function esCliente(username,pass) { //Comprueba si el usuario es cliente
    let existeCliente = false;
    for(let i = 0; i< sistema.listaClientes.length; i++) {
        let clienteActual = sistema.listaClientes[i];
        if(clienteActual.username.toLowerCase() === username.toLowerCase() && clienteActual.password === pass) {
            alert('cliente')
            existeCliente = true;
        }
    }
    return existeCliente;
}
// FUNCIONES GENERICAS


function login(){ //Ingresa a la aplicacion si cumple con los requisitos.
    let user = get('userLogin').value;
    let pass = get('passLogin').value;
    if (user == '' || pass == '') {
        alert('Los campos son obligatorios');
    } else if(esAdmin(user,pass)){
        mostrarSeccion('sectionAdministrador')
    } else if(esCliente(user,pass)){
        mostrarSeccion('sectionCliente')
    } else {
        alert('Debe registrarse');
        mostrarSeccion('registroApp');
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
function algoritmoLuhn(numero) {
    let suma = 0;
    let digitoVerificadorX = Number(numero.charAt(numero.length - 1));
    let contador = 0;
    let i = numero.length - 2;
    let hayNumero = true;

    while (i >= 0 && hayNumero) {
        let caracter = numero.charAt(i);
        if (!isNaN(caracter)) {
            let num = Number(caracter);
            if (contador % 2 === 0) {
                num = duplicarPar(num);
            }
            suma = suma + num;
        } else {
            hayNumero = false;
        }
        i--;
        contador++;
    }

    let digitoVerificadorValido = checkDigito(suma, digitoVerificadorX);
    let moduloDeLaSumaValidado = checkModulo(suma, digitoVerificadorX);
    return digitoVerificadorValido && moduloDeLaSumaValidado;
}

function tarjetaValida(numero){
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
    get('btnLogin').addEventListener('click',login);
    }else if(!passValida(passCliente) || esCliente(usernameCliente) || esAdmin(usernameCliente) || isNaN(cvc) || cvc.length < 3||!tarjetaValida(tarjeta)) {
        alert('Datos incorrectos');
    }else {
        let nuevoCliente = new Cliente (nombreCliente,apellidoCliente,usernameCliente,passCliente,tarjeta,cvc,estado);
        sistema.listaClientes.push(nuevoCliente);
        alert('usuario creado');
    }
}

