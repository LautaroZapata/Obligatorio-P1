window.addEventListener("load", inicio);

let sistema = new Sistema(); //Creamos el sistema con sus objetos.

function get(id) {
  return document.querySelector("#" + id); // Agarramos el ID del elemento.
}

function inicio() {
  get("btnLogin").addEventListener("click", login);
  get("btnRegistrar").addEventListener("click", registroCliente);
  get("btnSalirCliente").addEventListener("click", logout);
  get("btnSalirAdmin").addEventListener("click", logout);
  get("elegirProducto").addEventListener("change", actualizarProducto);
  get("btnComprar").addEventListener("click", comprar);
  get('pendientes').addEventListener('click',filtrarTabla);
  get('aprobadas').addEventListener('click',filtrarTabla);
  get('canceladas').addEventListener('click',filtrarTabla);
  get('todas').addEventListener('click',filtrarTabla);
  get('verOfertas').addEventListener('click',verOfertas);
  get('verTablaDeAprobacionAdmin').addEventListener('change',mostrarListaAprobaciones); // Muestra la lista compras pendientes, aprobadas o canceladas.



}

// FUNCIONES GENERICAS
function mostrar(id) {
  get(id).style.display = "block";
}
function ocultar(id) {
  get(id).style.display = "none";
}
function mostrarSeccion(id) {
  //Muestra unicamente una seccion y oculta el resto.
  ocultar("sectionCliente");
  ocultar("sectionAdministrador");
  ocultar("loginApp");
  mostrar(id);
}

// FUNCIONES GENERICAS

// FUNCIONES LOGIN Y REGISTRO con sus validaciones - FUNCIONES LOGIN Y REGISTRO con sus validaciones

function login() {
  //Ingresa a la aplicacion si cumple con los requisitos.
  let user = get("userLogin").value;
  let pass = get("passLogin").value;
  if (user == "" || pass == "") {
    alert("Los campos son obligatorios");
  } else if (sistema.esAdmin(user, pass)) {
    mostrarSeccion("sectionAdministrador");
    mostrarListaAprobaciones();
    get("loginForm").reset();
    sistema.usuarioLogueado = user;
  } else if (sistema.esCliente(user, pass)) {
    mostrarSeccion("sectionCliente");
    cargarProductos(sistema.listaProductos); // Carga los productos en el select con el parametro de lista de productos.
    seleccionarProducto(); // Selecciona el producto y crea el primer articulo seleccionado
    get("loginForm").reset();
    sistema.usuarioLogueado = user;
  } else {
    alert("Datos incorrectos");
  }
}

function passValida(password) { // Verifica si la password que llega por parametro cumple con los requisitos.
  let esValida = null;
  let cantMayus = 0;
  let cantMinus = 0;
  let cantNum = 0;

  if (password === "" || password.length < 4) {
    esValida = false;
  } else {
    for (let i = 0; i < password.length; i++) {
      let codigo = password.charCodeAt(i);
      if (codigo >= 48 && codigo <= 57) {
        cantNum++;
      } else if (codigo >= 65 && codigo <= 90) {
        cantMayus++;
      } else if (codigo >= 97 && codigo <= 122) {
        cantMinus++;
      }
    }
  }
  if (cantMayus >= 1 && cantMinus >= 1 && cantNum >= 1) {
    esValida = true;
  }
  return esValida;
}

function tarjetaValidaConGuion(numero) { // Valida si el numero de la tarjeta tiene guiones y si los tiene en la posicion correcta
  let numeros = "0123456789-";
  let esValida = false;
  if (numero.length == 19) {
    // Primero comprueba si la cantidad de numeros con los guiones inlcuidos son igual a 19
    for (let i = 0; i < numero.length; i++) {
      let posicionActual = numero.charAt(i);
      if (numero.charAt(4) === "-" && numero.charAt(9) == "-" && numero.charAt(14) == "-") {
        //Comprueba si es correcta la posicion de los guiones en el numero de la tarjeta.
        if (numeros.includes(posicionActual)) {
          //Comprobamos si los numeros estan inlcuidos en la variable numeros.
          esValida = true;
        }
      }
    }
  }
  return esValida;
}

function tarjetaValidaLuhn(numero) { // Verifica si el numero que recibe por parametro cumple con el algoritmo de Luhn
    let esValida = false;
    let numeros = '0123456789';
    let numeroLuhn = '';
    for(let i=0;i<numero.length;i++){
        let numActual = numero.charAt(i);
        if(numeros.includes(numActual)) {
            numeroLuhn += parseInt(numActual);
        }
    }
    if(algoritmoLuhn(numeroLuhn)){
        esValida = true;
    }
    return esValida
}
// NUMERO TARJETA VALIDO 1445-3512-5576-4076
// FUNCIONES ALGORITMO DE LUHN - FUNCIONES ALGORITMO DE LUHN - FUNCIONES ALGORITMO DE LUHN 
function algoritmoLuhn(pNumero) { 
    let suma = 0;
    let digitoVerificadorX = Number(pNumero.charAt(pNumero.length - 1));
    let contador = 0;
    let haynro = true;
    let i = pNumero.length - 2;


    while (i >= 0 && haynro) {
      let caracter = pNumero.charAt(i);
      if (!isNaN(caracter)) {
        let num = Number(caracter);
        if (contador % 2 == 0) {
          num = duplicarPar(num);
        }
        suma += num;
      } else {
        haynro = false;
      }
      i--;
      contador++;
    }
    let digitoVerificadorValido = checkDigito(suma, digitoVerificadorX);
    let modulodelasumaValiado = checkModulo(suma, digitoVerificadorX);
    return digitoVerificadorValido && modulodelasumaValiado;

  }

  function duplicarPar(pNum) {
    pNum = pNum * 2;
    if (pNum > 9) {
      pNum = 1 + (pNum % 10);
    }
    return pNum;
  }

  function checkDigito(pSuma, pDigito) {
    let total = 9 * pSuma;
    let ultimoNro = total % 10
    return ultimoNro === pDigito;
  }

  function checkModulo(pSuma, pDigito) {
    let total = pSuma + pDigito;
    let validacionFinal = false;
    if (total % 10 === 0 && total !== 0) {
      validacionFinal = true;
    }
    return validacionFinal;
  }

  // FUNCIONES ALGORITMO DE LUHN - FUNCIONES ALGORITMO DE LUHN - FUNCIONES ALGORITMO DE LUHN

function registroCliente() { // Comprueba que todos los requisitos para el registro sean validos.
  let nombreCliente = get("nombrePersona").value;
  let apellidoCliente = get("apellidoPersona").value;
  let usernameCliente = get("nombreUsuario").value.toLowerCase();
  let passCliente = get("passUsuario").value;
  let tarjeta = get("tarjeta").value;
  let cvc = parseInt(get("cvc").value);
  let estado = "pendiente";

  if (
    nombreCliente === "" ||
    apellidoCliente === "" ||
    usernameCliente === "" ||
    passCliente === "" ||
    tarjeta === "" ||
    cvc === ""
  ) {
    alert("Todos los campos son obligatorios");
  } else if (
    !passValida(passCliente) ||
    sistema.esCliente(usernameCliente) ||
    sistema.esAdmin(usernameCliente) ||
    isNaN(cvc) ||
    cvc.length < 3 ||
    !tarjetaValidaConGuion(tarjeta) || !tarjetaValidaLuhn(tarjeta)
  ) {
    alert("Datos incorrectos");
  } else { //Si se cumplen todos los campos de manera correcta entonces se crea un nuevo objeto de la clase Cliente.
    let nuevoCliente = new Cliente(
      nombreCliente,
      apellidoCliente,
      usernameCliente,
      passCliente,
      tarjeta,
      cvc,
      estado
    );
    sistema.listaClientes.push(nuevoCliente); // Y ese cliente se agrega a una lista de clientes
    alert("usuario creado");
  }
}

// FUNCIONES LOGIN Y REGISTRO con sus validaciones - FUNCIONES LOGIN Y REGISTRO con sus validaciones

function logout() {
  // Cierra la sesion y cambia el estado del usuario
  mostrarSeccion("loginApp");
  sistema.usuarioLogueado = null;
}


// COMPRA DE PRODUCTOS - COMPRA DE PRODUCTOS - COMPRA DE PRODUCTOS - COMPRA DE PRODUCTOS

function cargarProductos(lista) {
  // Carga los productos dentro del select en options para que el usuario posteriormente elija una.
  let texto = "";
  for (let i = 0; i < lista.length; i++) {
    let prodActual = lista[i];
    texto += `
            <option>${prodActual.nombre}</option>
        `;
  }
  get("elegirProducto").innerHTML = texto;
}

function seleccionarProducto() {
  // Cada vez que el usuario seleccione un producto del select se le creara un articulo para ese producto.

  let articulo = "";
  let nombreProducto = get("elegirProducto").value;
  let objProducto = sistema.obtenerProducto(nombreProducto); // Si existe el nombre nos devuelve el objeto entero del producto seleccionado.
  if (
    objProducto &&
    objProducto.verificarStockProducto() > 0 &&
    objProducto.verificarEstadoProducto() == true
  ) {
    // Si se cumple la condicion imprime el articulo cargando todas sus propiedades
    articulo += `
        <img src='${objProducto.url}'>
        <p>${objProducto.nombre}</p>
        <p>${objProducto.descripcion}</p>
        <p>$${objProducto.precio}</p>
        <p>${objProducto.estaEnOferta()}</p>
    `;
  }
  get("articuloProducto").innerHTML = articulo;
}

function actualizarProducto() {
  // Actualiza el articulo creado en el select segun la opcion elegida de producto.
  seleccionarProducto();
}

function filtrarTabla() { // Aplica el filtro en la tabla de compras de las diferentes opciones de estado. 
    let pendientes = get('pendientes');
    let aprobadas = get('aprobadas');
    let canceladas = get('canceladas');
    let lista;
    if(pendientes.checked) { //Comprueba cual radio button esta seleccionado y ejecuta la funcion con su estado correspondiente para mostrar el estado seleccionado.
      lista = sistema.obtenerEstadoCompra('pendiente');
      if(lista.length == 0) {
        ocultar ('tablaComprasCliente')
      }else {
        cargarTablaCompras('pendiente')
        mostrar("tablaComprasCliente");
      }
    } else if(aprobadas.checked){
      lista = sistema.obtenerEstadoCompra('aprobada');
      if(lista.length == 0) {
        ocultar ('tablaComprasCliente')
      }else {
        cargarTablaCompras('aprobada')
        mostrar("tablaComprasCliente");
      } 
    }else if(canceladas.checked) {
      lista = sistema.obtenerEstadoCompra('cancelada');
      if(lista.length == 0) {
        ocultar ('tablaComprasCliente')
      }else {
        cargarTablaCompras('cancelada')
        mostrar("tablaComprasCliente");
      }
    }else {
      lista = sistema.obtenerCompras()
      if(lista.length == 0) {
        ocultar('tablaComprasCliente')
      }else {
        cargarTablaCompras('')
        mostrar("tablaComprasCliente");
      }
    }
}

function cargarTablaCompras(estado = '') { //Obtiene una lista con un estado de compra y las carga en HTML como una tabla.
  let lista = [];
  if (estado == '') {
    lista = sistema.obtenerCompras();
  } else if(estado == 'pendiente') {
    lista = sistema.obtenerEstadoCompra('pendiente');
  }else if( estado == 'aprobada') {
    lista =sistema.obtenerEstadoCompra('aprobada')
 
  }else {
    lista =sistema.obtenerEstadoCompra('cancelada');
  }
  let articuloComprado = "";
  for (let i = 0; i < lista.length; i++) { //Recorre la lista obtenida del metodo obtenerEstadoCompra
    let compraActual = lista[i];
    articuloComprado += `
            <tr>
                <td><img src='${compraActual.imagen}'></td>
                <td>${compraActual.nombre}</td>
                <td>${compraActual.unidades}</td>
                <td>${compraActual.montoTotal}</td>
                <td>${compraActual.estado}</td>
                <td>${compraActual.comprador}</td>
        `;
    if (compraActual.estado == "pendiente") { // Si el estado de la compra es pendiente se agrega un boton de cancelar compra a la tabla.
      articuloComprado += `
                <td><input type='button' value='Cancelar Compra' id='${compraActual.id}-estadoCompra' class='cancelarCompra'></td>
            </tr>
            `;
    }

    get("tbodyComprasCliente").innerHTML = articuloComprado;
    let obtenerBtnCancelarCompra = document.querySelectorAll(".cancelarCompra"); //Se obtienen todos los botones de cancelar compra.
    for (let i = 0; i < obtenerBtnCancelarCompra.length; i++) { //Recorre todos los elementos que tengan la clase cancelarCompra y cuando se le hace click a uno de ellos se actualiza a cancelado el estado de compra.
      let btnActual = obtenerBtnCancelarCompra[i];
      btnActual.addEventListener("click", cancelarCompraCliente);
    }
  }
}
function comprar() {
  // Cuando el cliente realiza una compra se pushea la compra como un objeto Compra al array de listaCompras y se carga la tabla con el contenido
  let nombreProducto = get("elegirProducto").value;
  let unidades = parseInt(get("cantidadUnidades").value);
  let producto = sistema.obtenerProducto(nombreProducto);
  if (isNaN(unidades) || unidades <= 0 || producto.estado == false) {
    alert("Error");
  } else {
    sistema.listaCompras.push(
      new Compra(producto.nombre, unidades, producto.precio, producto.url)
    );
  }
  cargarTablaCompras() // Se carga la tabla con el nuevo contenido de la compra
  filtrarTabla() // Filtra esta tabla para que siga mostrando el radio button seleccionado

}

function cancelarCompraCliente() { //Actualiza la tabla de compras del cliente.
  let idCompra = parseInt(this.id); //Como se ejecuta en un boton agarra el id de ese boton que se esta ejecutando
  sistema.cancelarCompra(idCompra);
   cargarTablaCompras();
   filtrarTabla()
}

function verOfertas(){
  let listaOfertas = [];
  let listaProductos = sistema.listaProductos;
  for(let i =0; i< listaProductos.length;i++) {
    let prodActual = listaProductos[i];
    if(prodActual.oferta == true) {
      listaOfertas.push(prodActual);
    }
  }
  cargarProductos(listaOfertas)

}


function montoTotalySaldoCliente() {
  let parrafo = get('clienteSaldoMontoTotal')
  let cliente = sistema.obtenerCliente(sistema.usuarioLogueado)
  let listaAprobadas =  sistema.obtenerEstadoCompra('aprobada');
  let montoTotalComprasAprobadas;
  for(let i=0; i< listaAprobadas.length;i++){
    let compraActual = listaAprobadas[i];
    montoTotalComprasAprobadas += compraActual.montoTotal
  }
  parrafo.innerHTML = `${cliente.saldo} montoTotal:${montoTotalComprasAprobadas}`  

}

//ARREGLAR FUNCTION


// COMPRA DE PRODUCTOS - COMPRA DE PRODUCTOS - COMPRA DE PRODUCTOS - COMPRA DE PRODUCTOS



//PERFIL ADMINISTRADOR - PERFIL ADMINISTRADOR - PERFIL ADMINISTRADOR - PERFIL ADMINISTRADOR

function mostrarListaAprobaciones() {
  let select = get('verTablaDeAprobacionAdmin').value;
  let lista;
  if(select == 'Compras Pendientes') {
    lista = sistema.obtenerEstadoCompra('pendiente')
    if(lista.length == 0) {
      ocultar('tablaAprobacionesCompras')
    }else {
      cargarTablaDeAprobaciones('pendiente')
    }
  }else if(select == 'Compras Canceladas') {
    lista = sistema.obtenerEstadoCompra('cancelada')
    if(lista.length == 0) {
      ocultar('tablaAprobacionesCompras')
    }else {
      lista = cargarTablaDeAprobaciones('cancelada')
    }
  }else {
    lista = sistema.obtenerEstadoCompra('aprobada')
    if(lista.length == 0) {
      ocultar('tablaAprobacionesCompras')
    }else {
    cargarTablaDeAprobaciones('aprobada')
    }
  }

}

function cargarTablaDeAprobaciones(estado) { 
  let lista = [];
  if(estado == 'pendiente') {
    lista = sistema.obtenerEstadoCompra('pendiente');
  }else if( estado == 'aprobada') {
    lista =sistema.obtenerEstadoCompra('aprobada')
  }else {
    lista =sistema.obtenerEstadoCompra('cancelada');
  }

  let articuloComprado = "";
  for (let i = 0; i < lista.length; i++) { 
    let compraActual = lista[i];
    articuloComprado += `
            <tr>
                <td>${compraActual.comprador}</td>
                <td>${compraActual.nombre}</td>
                <td>${compraActual.montoTotal}</td>
                <td>${compraActual.estado}</td>
        `;
    if (compraActual.estado == "pendiente") { 
      articuloComprado += `
                <td><input type='button' value='Aprobar Compra' id='${compraActual.id}-estadoCompraAdmin' class='aprobarCompra'></td>
                
            </tr>
            `;
    }

    get("tablaAprobaciones").innerHTML = articuloComprado;
    let obtenerBtnAprobarCompra = document.querySelectorAll(".aprobarCompra"); 
    for (let i = 0; i < obtenerBtnAprobarCompra.length; i++) { 
      let btnActual = obtenerBtnAprobarCompra[i];
      btnActual.addEventListener("click", aprobarCompraAdmin);
    }
  }
  mostrar('tablaAprobacionesCompras')
}

function aprobarCompraAdmin () {
  let idCompra = parseInt(this.id)
  sistema.aprobarCompra(idCompra)
  montoTotalySaldoCliente();
  mostrarListaAprobaciones()
  cargarTablaCompras()
}


//PERFIL ADMINISTRADOR - PERFIL ADMINISTRADOR - PERFIL ADMINISTRADOR - PERFIL ADMINISTRADOR






// MOSTRAR EN PARRAFO DE CLIENTE MONTO TOTAL DE TODAS LAS COMPRAS Y SALDO DISPONIBLE.