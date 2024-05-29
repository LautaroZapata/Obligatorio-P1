window.addEventListener('load',inicio);

let sistema = new Sistema();

function get (id) {
    return document.querySelector('#'+id); // Agarramos el ID del elemento.
}
function mostrarSectionPrincipal () {
    ocultar('registroApp');
    ocultar('sectionCliente');
    mostrar('loginApp'); //Luego cambiar para hacer la function generica por id (parametro)
}
function inicio () {
    mostrarSectionPrincipal('loginApp');
    get('btnMostrarRegistrar').addEventListener('click',registrar); // Nos muestra la seccion de Registro
    get('btnVolverInicio').addEventListener('click',login); // Nos devuelve a la seccion Login
    get('btnLogin').addEventListener('click',sectionCliente); // Nos muestra la seccion Cliente
    get('btnSalir').addEventListener('click',mostrarSectionPrincipal);


}

// FUNCIONES GENERICAS
function mostrar (id) {
    get(id).style.display = 'block';
}

function ocultar (id) {
    get(id).style.display = 'none';
}

function login () {
    ocultar('registroApp');
    mostrar('loginApp')
}



// FUNCIONES GENERICAS

// FUNCIONES CLIENTE
function registrar () {
    ocultar('loginApp');
    mostrar('registroApp')
}
function sectionCliente () {
    // VERIFICAR QUE NO SEA ADMIN.
    mostrar('sectionCliente');
    ocultar('loginApp');
}

// FUNCIONES CLIENTE



