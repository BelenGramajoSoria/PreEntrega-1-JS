
let datos = [];
let carrito = [];

// datos
function crearProducto() {
    let nombre = prompt("Escribi el nombre del producto:");
    let marca = prompt("Marca del producto");
    let precio = parseFloat(prompt("Precio del producto"));
    let cantidad = parseInt(prompt("Cantidad de producto que posees"));
    let vencimiento = prompt("Cual es la fecha de vencimiento?");

    // sumar un producto
    let producto = {
        nombre: nombre,
        marca: marca,
        precio: precio,
        cantidad: cantidad,
        vencimiento: vencimiento
    };

    datos.push(producto);
    alert("Agregado");
}

// Buscar un prod
function buscarProducto() {
    let busqueda = prompt("Que producto buscas?");
    let resultado = datos.filter(producto => producto.nombre.toLowerCase() === busqueda.toLowerCase());

    if (resultado.length > 0) {
        mostrarEnPantalla(resultado, 'productos');
        alert(`Encontre ${resultado.length}`);
    } else {
        alert("No hay stock");
    }
}

// lista de productos cargads
function mostrarProducto() {
    if (datos.length === 0) {
        alert("No hay productos cargados");
        return;
    }

    mostrarEnPantalla(datos, 'productos');
}

// Mostrar los productos 
function mostrarEnPantalla(productos, elementoId) {
    let listaProductos = document.getElementById(elementoId);
    listaProductos.innerHTML = '';

    productos.forEach(producto => {
        let item = document.createElement('section');
        item.className = 'productoI';
        item.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>${producto.marca}</p>
            <p>${producto.precio}</p>
            <button class="producto-btn" onclick="agregarAlCarrito('${producto.nombre}')">Agregar al carrito</button>
        `;
        listaProductos.appendChild(item);
    });
}

// Agregar productos al carrito
function agregarAlCarrito(nombreProducto) {
    let producto = datos.find(producto => producto.nombre.toLowerCase() === nombreProducto.toLowerCase());

    if (producto) {
        carrito.push(producto);
        mostrarCarrito();
        alert(`Agregaste ${producto.nombre} al carrito`);
    } else {
        alert("No hay stock");
    }
}

// Mostrar el carrito de ventas
function mostrarCarrito() {
    let carritoElement = document.getElementById('venta-productos');
    carritoElement.innerHTML = '';

    if (carrito.length === 0) {
        document.getElementById('carrito-vacio').style.display = 'block';
        return;
    } else {
        document.getElementById('carrito-vacio').style.display = 'none';
    }

    carrito.forEach((producto, index) => {
        let item = document.createElement('div');
        item.className = 'venta-producto';
        item.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>${producto.marca}</p>
            <p>${producto.precio}</p>
            <button class="venta-producto-btn" onclick="eliminarDelCarrito(${index})">X</button>
        `;
        carritoElement.appendChild(item);
    });

    actualizarTotal();
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
}

// Función para actualizar el total del carrito
function actualizarTotal() {
    let total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    document.getElementById('totalCarrito').textContent = `$${total.toFixed(2)}`;
}
