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

// FUNCIONES LOGIN Y REGISTRO con sus validaciones

function login() {
  //Ingresa a la aplicacion si cumple con los requisitos.
  let user = get("userLogin").value;
  let pass = get("passLogin").value;
  if (user == "" || pass == "") {
    alert("Los campos son obligatorios");
  } else if (sistema.esAdmin(user, pass)) {
    mostrarSeccion("sectionAdministrador");
    get("loginForm").reset();
    sistema.usuarioLogueado = user;
  } else if (sistema.esCliente(user, pass)) {
    mostrarSeccion("sectionCliente");
    cargarProductos(); // Carga los productos en el select
    seleccionarProducto(); // Selecciona el producto y crea el primer articulo seleccionado
    get("loginForm").reset();

    sistema.usuarioLogueado = user;
  } else {
    alert("Datos incorrectos");
  }
}

function passValida(password) {
  let esValida = null;
  let cantMayus = 0;
  let cantMinus = 0;
  let cantNum = 0;

  //String 5 caracteres, al menos una mayus, una minus y un numero.
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

function tarjetaValidaConGuion(numero) {
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

function tarjetaValidaLuhn(numero) {
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
function registroCliente() {
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
  } else {
    let nuevoCliente = new Cliente(
      nombreCliente,
      apellidoCliente,
      usernameCliente,
      passCliente,
      tarjeta,
      cvc,
      estado
    );
    sistema.listaClientes.push(nuevoCliente);
    alert("usuario creado");
  }
}

// FUNCIONES LOGIN Y REGISTRO con sus validaciones

function logout() {
  // Cierra la sesion y cambia el estado del usuario
  mostrarSeccion("loginApp");
  sistema.usuarioLogueado = null;
}




// COMPRA DE PRODUCTOS

function cargarProductos() {
  // Carga los productos dentro del select en options para que el usuario posteriormente elija una.
  let texto = "";
  let listaProds = sistema.listaProductos;
  for (let i = 0; i < listaProds.length; i++) {
    let prodActual = listaProds[i];
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
  // Actualiza el articulo creado segun la opcion elegida de producto.
  seleccionarProducto();
}

function filtrarTabla() {
    let pendientes = get('pendientes');
    let aprobadas = get('aprobadas');
    let canceladas = get('canceladas');
    let todas = get('todas');
    if(pendientes.checked) { 
      cargarTablaCompras('pendiente')
    } else if(aprobadas.checked){
      cargarTablaCompras('aprobada')
    }else if(canceladas.checked) {
      cargarTablaCompras('cancelada')
    }else {
      cargarTablaCompras('')
    }
}
function cargarTablaCompras(estado = '') {
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
  for (let i = 0; i < lista.length; i++) {
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
    if (compraActual.estado == "pendiente") {
      articuloComprado += `
                <td><input type='button' value='Cancelar Compra' id='${compraActual.id}-estadoCompra' class='cancelarCompra'></td>
            </tr>
            `;
    }

    get("tbodyComprasCliente").innerHTML = articuloComprado;
    let obtenerBtnCancelarCompra = document.querySelectorAll(".cancelarCompra");
    for (let i = 0; i < obtenerBtnCancelarCompra.length; i++) {
      let btnActual = obtenerBtnCancelarCompra[i];
      btnActual.addEventListener("click", actualizarTablaCliente);
    }
    mostrar("tablaComprasCliente");
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
    cargarTablaCompras();
  }
}

function actualizarTablaCliente() { //Actualiza la tabla de compras del cliente.
  let idCompra = parseInt(this.id); //Como se ejecuta en un boton agarra el id de ese boton que se esta ejecutando
  sistema.cancelarCompra(idCompra);
   cargarTablaCompras();
}


// COMPRA DE PRODUCTOS


//COMENTAR BIEN EL CODIGO
// Verificar en radio buttons y no mostrar nada si no hay compras con ese filtro
// MOSTRAR EN PARRAFO DE CLIENTE MONTO TOTAL DE TODAS LAS COMPRAS Y SALDO DISPONIBLE.
// CREAR BOTON QUE MUESTRE SOLO PRODUCTOS EN OFERTA

//PERFIL ADMINISTRADOR