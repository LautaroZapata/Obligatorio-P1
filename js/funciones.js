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
  get("elegirProducto").addEventListener("change", seleccionarProducto);
  get("btnComprar").addEventListener("click", comprar);
  get('pendientes').addEventListener('click',filtrarTabla);
  get('aprobadas').addEventListener('click',filtrarTabla);
  get('canceladas').addEventListener('click',filtrarTabla);
  get('todas').addEventListener('click',filtrarTabla);
  get('verOfertas').addEventListener('click',verOfertas);
  get('verTablaDeAprobacionAdmin').addEventListener('change',mostrarListaAprobaciones); // Muestra la lista compras pendientes, aprobadas o canceladas.
  get('btnCrearProd').addEventListener('click',crearProducto);
  get('elegirProductoAdmin').addEventListener('change',mostrarProductoAdmin);
  get('btnModificarProducto').addEventListener('click',modificarEstadoProducto);
  get('btnVerInforme').addEventListener('click',verInformeDeGanancias);
  get('verTodosLosProductos').addEventListener('click',verTodosLosProductos)

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
  user.toLowerCase()
  let pass = get("passLogin").value;
  if (user == "" || pass == "") {
    alert("Los campos son obligatorios");
  } else if (sistema.esAdmin(user, pass)) {
    mostrarSeccion("sectionAdministrador");
    mostrarListaAprobaciones();
    cargarProductosAdmin(sistema.listaProductos)
    mostrarProductoAdmin();
    get("loginForm").reset();
    sistema.usuarioLogueado = user;
  } else if (sistema.esCliente(user, pass)) {
    sistema.usuarioLogueado = user;
    cargarProductos(sistema.listaProductos); // Carga los productos en el select con el parametro de lista de productos.
    seleccionarProducto()
    cargarTablaCompras()
    filtrarTabla()
    mostrarSeccion("sectionCliente");
    montoTotalySaldoCliente();
    get("loginForm").reset();
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
  sistema.usuarioLogueado = null;
  mostrarSeccion("loginApp");
}


// COMPRA DE PRODUCTOS - COMPRA DE PRODUCTOS - COMPRA DE PRODUCTOS - COMPRA DE PRODUCTOS

function verTodosLosProductos(){ // Te devuelve todos los productos en el select 
  cargarProductos(sistema.listaProductos)
  seleccionarProducto()
}

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


function filtrarTabla() { // Aplica el filtro en la tabla de compras de las diferentes opciones de estado. 
    let pendientes = get('pendientes');
    let aprobadas = get('aprobadas');
    let canceladas = get('canceladas');
    let lista;
    if(pendientes.checked) { //Comprueba cual radio button esta seleccionado y ejecuta la funcion con su estado correspondiente para mostrar el estado seleccionado.
      lista = sistema.obtenerMisComprasPorEstado('pendiente');
      if(lista.length == 0) {
        ocultar ('tablaComprasCliente')
      }else {
        cargarTablaCompras('pendiente')
        mostrar("tablaComprasCliente");
      }
    } else if(aprobadas.checked){
      lista = sistema.obtenerMisComprasPorEstado('aprobada');
      if(lista.length == 0) {
        ocultar ('tablaComprasCliente')
      }else {
        cargarTablaCompras('aprobada')
        mostrar("tablaComprasCliente");
      } 
    }else if(canceladas.checked) {
      lista = sistema.obtenerMisComprasPorEstado('cancelada');
      if(lista.length == 0) {
        ocultar ('tablaComprasCliente')
      }else {
        cargarTablaCompras('cancelada')
        mostrar("tablaComprasCliente");
      }
    }else {
      lista = sistema.obtenerMisCompras()
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
    lista = sistema.obtenerMisCompras();
  } else if(estado == 'pendiente') {
    lista = sistema.obtenerMisComprasPorEstado('pendiente');
  }else if( estado == 'aprobada') {
    lista =sistema.obtenerMisComprasPorEstado('aprobada')

  }else {
    lista =sistema.obtenerMisComprasPorEstado('cancelada');
  }
  
  let articuloComprado = "";
  for (let i = 0; i < lista.length; i++) { //Recorre la lista obtenida del metodo obtenerEstadoCompra
    let compraActual = lista[i];
    if(sistema.usuarioLogueado == compraActual.comprador.username){
      articuloComprado += `
            <tr>
                <td><img src='${compraActual.imagen}'></td>
                <td>${compraActual.nombre}</td>
                <td>${compraActual.unidades}</td>
                <td>${compraActual.montoTotal}</td>
                <td>${compraActual.estado}</td>
                <td>${compraActual.comprador.username}</td>
        `;
      if (compraActual.estado == "pendiente") { // Si el estado de la compra es pendiente se agrega un boton de cancelar compra a la tabla.
        articuloComprado += `
          <td><input type='button' value='Cancelar Compra' id='${compraActual.id}-estadoCompra' class='cancelarCompra'></td>
          </tr>`;
      }
      get('tbodyComprasCliente').innerHTML = articuloComprado;

      let obtenerBtnCancelarCompra = document.querySelectorAll(".cancelarCompra"); //Se obtienen todos los botones de cancelar compra.
      for (let i = 0; i < obtenerBtnCancelarCompra.length; i++) { //Recorre todos los elementos que tengan la clase cancelarCompra y cuando se le hace click a uno de ellos se actualiza a cancelado el estado de compra.
        let btnActual = obtenerBtnCancelarCompra[i];
        btnActual.addEventListener("click", cancelarCompraCliente);
      }
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

function verOfertas(){ // Cuando se ejecuta se muestran unicamente los productos en oferta dentro del select donde mostramos los productos disponibles.
  let listaOfertas = [];
  let listaProductos = sistema.listaProductos;
  for(let i =0; i< listaProductos.length;i++) {
    let prodActual = listaProductos[i];
    if(prodActual.oferta == true) {
      listaOfertas.push(prodActual);
    }
  }
  cargarProductos(listaOfertas)
  seleccionarProducto()

}


function montoTotalySaldoCliente() { // Obtiene el objeto del cliente, luego recorre la lista de compras aprobadas y actualiza en la seccion cliente el monto total de sus compras y su saldo actual.
  let parrafo = get('clienteSaldoMontoTotal')
  let usernameCliente = sistema.usuarioLogueado;
  let cliente = sistema.obtenerCliente(usernameCliente)
  let listaAprobadas =  sistema.obtenerMisComprasPorEstado('aprobada');
  let montoTotalComprasAprobadas = 0;
  for(let i=0; i< listaAprobadas.length;i++){
    let compraActual = listaAprobadas[i];
    if(usernameCliente == compraActual.comprador.username) {
      montoTotalComprasAprobadas += compraActual.montoTotal;
    }
  }
  parrafo.innerHTML = `Saldo disponible: $${cliente.saldo} Monto total de compras: ${montoTotalComprasAprobadas}`  
}



// COMPRA DE PRODUCTOS - COMPRA DE PRODUCTOS - COMPRA DE PRODUCTOS - COMPRA DE PRODUCTOS



//PERFIL ADMINISTRADOR - PERFIL ADMINISTRADOR - PERFIL ADMINISTRADOR - PERFIL ADMINISTRADOR

function mostrarListaAprobaciones() { // Segun el select que tengamos elegido muestra sutabla correspondiente de compras.
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

function cargarTablaDeAprobaciones(estado) {  //Carga la tabla correspondiente segun el parametro que reciba. Si el estado es pendiente se generan botones para aprobar compra automaticamente y con un id incremental que posteriormente lo manipulamos por clases.
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
                <td>${compraActual.comprador.username}</td>
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

function aprobarCompraAdmin () { // Aprueba la compra del cliente y actualiza las tablas tanto de cliente como de administrador
  let idCompra = parseInt(this.id)
  sistema.aprobarCompra(idCompra)
  console.log(idCompra);
  mostrarListaAprobaciones()
  cargarTablaCompras()
}



function crearProducto (){
  let nombreProd = get('crearNombreProd').value;
  let precioProd = parseInt(get('crearPrecioProd').value);
  let descProd = get('crearDescProd').value;
  let urlProd = get('crearImgProd').value;
  let stockProd = parseInt(get('crearStockProd').value);

  if(nombreProd == '' || precioProd == '' || urlProd == '' || stockProd == '' || descProd == '') {
    alert('Ningun campo puede estar vacio');
  }else {
    sistema.listaProductos.push(new Producto (nombreProd,precioProd,descProd,urlProd,stockProd))
    alert('Producto creado con exito')
  }
}

function mostrarProductoAdmin(){ // Muestra el producto seleccionado del select como un articulo.
  let articulo = "";
  let nombreProducto = get("elegirProductoAdmin").value;
  let objProducto = sistema.obtenerProducto(nombreProducto); // Si existe el nombre nos devuelve el objeto entero del producto seleccionado.
    articulo += `
        <img src='${objProducto.url}'>
        <p>${objProducto.nombre}</p>
        <p>$${objProducto.precio}</p>
    `;
  get("articleAdmin").innerHTML = articulo;
}

function modificarEstadoProducto () { 
  let nombreProducto = get('elegirProductoAdmin').value;
  let objProducto = sistema.obtenerProducto(nombreProducto);
  let stock = get('modificarStock').value;
  let estadoActivo = get('estadoProductoActivo');
  let ofertaActiva = get('ofertaProductoActivo');
  
  if(estadoActivo.checked){
    objProducto.estado = true;
  }else {
    objProducto.estado = false;
  }
  if(ofertaActiva.checked) {
    objProducto.oferta = true;
  }else {
    objProducto.oferta = false;
  }

  if(parseInt(stock) <=0) {
    objProducto.estado = false;
    objProducto.stock = 0;
    alert('El producto no tiene stock y su estado es pausado.')
  }else if(stock == '' || stock == isNaN){
    objProducto.stock = objProducto.stock
  } else {
    objProducto.stock = parseInt(stock);
  }
}
function cargarProductosAdmin(lista){ // Carga los productos en el select para posteriormente modificar el producto.
  let texto = "";
  for (let i = 0; i < lista.length; i++) {
    let prodActual = lista[i];
    texto += `
            <option>${prodActual.nombre}</option>
        `;
  }
  get("elegirProductoAdmin").innerHTML = texto;
}


function verInformeDeGanancias () { //Muestra en lista el producto con sus unidades vendidas y luego la ganancia total de todos los productos
  let texto = ''
  let productos = sistema.listaProductos;
  let gananciaTotal = 0;
  let comprasAprobadas = sistema.obtenerEstadoCompra('aprobada');
  for(let i  =0; i < productos.length ; i++){
    let prodActual = productos[i];
    if(prodActual.unidadesVendidas > 0 ){
      texto += `
        <li>Producto: ${prodActual.nombre} Cantidad de unidades vendidas: ${prodActual.unidadesVendidas}</li><br>
      `
    }
  }
  for(let i =0; i< comprasAprobadas.length; i++) {
        let compraActual = comprasAprobadas[i];
        gananciaTotal += compraActual.montoTotal;
  }
  texto+= `<br><br><li>Ganancia Total $${gananciaTotal}</li>`
  get('informeDeGanancias').innerHTML = texto;
}
//PERFIL ADMINISTRADOR - PERFIL ADMINISTRADOR - PERFIL ADMINISTRADOR - PERFIL ADMINISTRADOR


