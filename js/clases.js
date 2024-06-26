class Sistema {
    constructor () {
        this.listaAdmins = [
            new Administrador ('Lautaro','1234'),
            new Administrador ('Gonzalo','4321'), 
            new Administrador ('Martin','asd'), 
            new Administrador('Roman','dsa'), 
            new Administrador ('ADMIN','admin')];
        this.listaClientes = [
            new Cliente ('Juan','Cano','juancano','juan1234','',111,'activo'),
            new Cliente ('Lucas','Perez','lucasperez','lucas4321','',222,'activo'), 
            new Cliente ('Ana','Casas','anacasas','ana1234','',333,'activo'), 
            new Cliente ('Lorena','Diaz','lorenadiaz','lorena4321','',444,'inactivo'), 
            new Cliente ('Juana', 'De Arco', 'juanadearco','juana1234','',555,'inactivo')];
        this.listaProductos = [
            new Producto ('Remera Deportiva',600,'Remera negra excelente para ejercicio.','https://f.fcdn.app/imgs/3529dd/www.textilshop.com.uy/tex/5bb6/original/catalogo/500033neg1/460x460/remera-dry-fit-negro.jpg',15,false,true),
            new Producto ('Calzado Deportivo',2500,'Calzado ideal para maratones y/o carreras.', 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTN_tz1C4Ez3IIC4-th4uv_Ap5_l1mTHRBsM-ixYpPZSSDqClHRYb6jxNSnSTUHXMUhcbG2pQoambnZu_QQIHCrEJ-VSR1xU7NS6odB4o4WnYMhZ3ByIGT3SXS5wqg&usqp=CAc',30,true,true),
            new Producto ('Guantes',350,'La mejor opcion para hacer ejercicio con bajas temperaturas.','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVqHM9ukFq6HaCfCVKyGnPgjF8IBa4HYPDFA&s',80,true,false),
            new Producto ('Raqueta de Tenis',5000,'La mejor opcion para adentrarse en el Tenis.','https://http2.mlstatic.com/D_NQ_NP_799997-MLU74180198535_012024-O.webp',20,true,false),
            new Producto ('Pelota de Basketball',800,'Pelota profesional de basketball','https://http2.mlstatic.com/D_NQ_NP_799997-MLU74180198535_012024-O.webp',114,true,false),
            new Producto ('Pesas Mancuerna',300,'Peso de 1Kg.','https://contents.mediadecathlon.com/p1833694/k$7371d614fb7e289832b1d07789ad7559/pesas-2-x-1kg-de-vinilo-fitness-gimnasia-en-casa-pilates-nyamba-verde.jpg?format=auto&quality=40&f=452x452',33,true,false),
            new Producto('Pelota de Futbol',1000,'Pelota profesional de futbol','https://http2.mlstatic.com/D_NQ_NP_782966-MLA52249028475_112022-O.webp',56,true,false),
            new Producto ('Gorra de Natacion',200,'Gorra de natacion unisex.','https://tiendacdn.farmashop.com.uy/media/catalog/product/cache/409ad6670ab0bff65bb3863f821117f2/8/2/825527_02.jpg',41,true,false),
            new Producto ('Malla de Natacion',800,'Malla para mujer','https://lacasadelnadador.uy/wp-content/uploads/2020/10/MALLA-ARENA-SOLID-SWIM-2-1.jpg',12,true,false),
            new Producto ('Calzado de Futbol',3000,'Calzado para canchas de futbol 5.','https://f.fcdn.app/imgs/54e4e5/menpi.uy/menpuy/2f86/original/catalogo/DD9477600-0-1/460x460/champion-nike-futbol-hombre-phantom-gx-academy-tf-brt-crinson-black-s-c.jpg',23,true,false)
        ];
        this.usuarioLogueado = null;
        this.listaCompras = [];



    }
    esAdmin(username,password) { //Metodo que comprueba si el usuario es administrador o no lo es.
        let existeAdmin = false;
        for(let i = 0; i < this.listaAdmins.length;i++){
            let adminActual = this.listaAdmins[i];
            if(adminActual.username.toLowerCase() === username.toLowerCase() && adminActual.password === password){
                alert('Admin');
                existeAdmin = true;
            }
        }
        return existeAdmin;
    }
    esCliente(username,password) { //Metodo que comprueba si el usuario es cliente o no lo es.
        let existeCliente = false;
        for(let i =0;i<this.listaClientes.length;i++) {
            let clienteActual = this.listaClientes[i];
            if(clienteActual.username.toLowerCase() === username.toLowerCase() && clienteActual.password === password) {
                alert('Cliente');
                existeCliente = true;
            }
        }
        return existeCliente;
    }
    
    
    
    obtenerProducto(nombre) { // Obtiene un nombre y comprueba que exista. Si existe devuelve el objeto entero.
        let resp=null
        for(let i=0 ; i< this.listaProductos.length; i++){
            let objActual=this.listaProductos[i];
            if(nombre==objActual.nombre){
                resp=objActual
            }
        }
        return resp
    }
    obtenerCliente(username) {
        let resp =null;
        for(let i = 0; i< this.listaClientes.length;i++) {
            let clienteActual = this.listaClientes[i];
            if(clienteActual.username == username) {
                resp = clienteActual;
            }
        }
        return resp
    }    
    obtenerCompras() { //Devuelve el array de la lista de compras. (Lo utiliza el administrador)
        return this.listaCompras;
    }
    cancelarCompra(idCompra) {
        for(let i = 0; i< this.listaCompras.length;i++) {
            let compraActual = this.listaCompras[i];
            if(idCompra == compraActual.id) {
                compraActual.estado = 'cancelada';
                console.log(compraActual.estado);
            }
        }
    }
    aprobarCompra(idCompra) { // Recorre la lista de compras pendientes y si coincide el parametro idCompra con el id de la compra se actualiza el estado de la compra y se le resta el monto total de la compra al saldo del cliente
        for(let i =0; i< this.listaCompras.length;i++) {
            let compraActual = this.listaCompras[i];
            let cliente = this.obtenerCliente(compraActual.comprador.username)
            let producto = this.obtenerProducto(compraActual.nombre)
            if(idCompra == compraActual.id) {
                if(compraActual.estado == "pendiente" && cliente.saldo >= compraActual.montoTotal && compraActual.unidades <= producto.stock) {
                    compraActual.estado = 'aprobada'
                    cliente.saldo -= compraActual.montoTotal
                    producto.stock -= compraActual.unidades;
                    producto.unidadesVendidas ++
                }else {
                    alert('Saldo insuficiente o producto sin stock');
                }
                if(producto.stock == 0) {
                    producto.estado = false
                }
            }
        }        
    }

     obtenerEstadoCompra(estado){ //Obtiene el estado del producto y el objeto completo (funcion admin)
        let lista =[];
        for(let i =0; i < this.listaCompras.length;i++) {
            let compraActual = this.listaCompras[i];
            if(compraActual.estado == estado ) { 
                lista.push(compraActual);
            }
        }
        return lista;
    }
    obtenerMisComprasPorEstado(estado){ //Obtiene el estado del producto y el objeto completo (funcion cliente)
        let lista =[];
        for(let i =0; i < this.listaCompras.length;i++) {
            let compraActual = this.listaCompras[i];
            if(compraActual.estado == estado && this.usuarioLogueado == compraActual.comprador.username ) { 
                lista.push(compraActual);
            }
        }
        return lista;
    }
    obtenerMisCompras() { // El cliente obtiene sus compras
        let lista =[];
        for(let i =0; i < this.listaCompras.length;i++) {
            let compraActual = this.listaCompras[i];
            if(this.usuarioLogueado == compraActual.comprador.username ) { 
                lista.push(compraActual);
            }
        }
        return lista;
    }

}


class Administrador {
    constructor (username,password) {
        this.username = username;
        this.password = password;
    }
    
}

let idCliente = 1;  //Contador de id inicializado en 1 para que se incremente automaticamente en cada cliente el id y sea unico

class Cliente {
    constructor (nombre,apellido,username,password,tarjeta,cvc,estado) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.username = username;
        this.password = password;
        this.tarjeta = tarjeta;
        this.cvc = cvc;
        this.estado = estado;
        this.id = 'numCliente ' +(idCliente++);
        this.saldo = 3000;
    }
    
}

let idProducto = 1; // Contador de id para productos inicializado en 1 para que cada producto tenga su id unico.

class Producto {
    constructor (nombre,precio,descripcion,url,stock){
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.url = url;
        this.stock = stock;
        this.estado = true;
        this.oferta = false;
        this.id = 'PROD_ID_ ' + (idProducto++)
        this.unidadesVendidas = 0;
    }
    estaEnOferta() { // Verifica si el producto esta en oferta o no y devuelve un mensaje
        let oferta = '';
        if(this.oferta == true) {
            oferta = 'EN OFERTA'
        } else if(this.oferta == false) {
            oferta = 'NO ESTA EN OFERTA'
        }
        return oferta
    }
    verificarEstadoProducto () { // Verifica  el estado del producto y lo retorna
        return this.estado;
    }
    verificarStockProducto () { // Retorna la cantidad de stock
        return this.stock
    }
}


let idCompra = 1;

class Compra {
    constructor (nombre,unidades,precio,imagen,) {
        this.nombre = nombre,
        this.unidades = unidades,
        this.precio = precio,
        this.estado = 'pendiente',
        this.montoTotal = this.precio * this.unidades,
        this.imagen = imagen,
        this.id = idCompra++,
        this.comprador = sistema.obtenerCliente(sistema.usuarioLogueado)

    }
    
    
}