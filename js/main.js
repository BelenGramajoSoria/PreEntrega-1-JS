let datos = JSON.parse(localStorage.getItem('productos')) || [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let ventas = JSON.parse(localStorage.getItem('ventas')) || [];

//Datos
function crearProducto() {
    let nombre = prompt("Escribí el nombre del producto:");
    let marca = prompt("Marca del producto");
    let precio = parseFloat(prompt("Precio del producto (solo números)").replace(/[^0-9.]/g, ''));
    let cantidad = parseInt(prompt("Cantidad de producto en stock (solo números)").replace(/[^0-9]/g, ''));
    let vencimiento = prompt("Cuál es la fecha de vencimiento?");

    if (isNaN(precio) || isNaN(cantidad)) {
        alert("Solo números, por favor");
        return;
    }

    let producto = {
        nombre: nombre,
        marca: marca,
        precio: precio,
        cantidad: cantidad,
        vencimiento: vencimiento
    };
    datos.push(producto);
    localStorage.setItem('productos', JSON.stringify(datos));
    alert("Producto agregado");
}

//Buscar un producto
function buscarProducto() {
    let busqueda = prompt("¿Qué producto buscas?");
    let resultado = datos.filter(producto => producto.nombre.toLowerCase() === busqueda.toLowerCase());

    if (resultado.length > 0) {
        mostrarEnPantalla(resultado, 'productos');
        alert(`Encontré ${resultado.length}`);
    } else {
        alert("No hay stock");
    }
}

//Lista de productos cargados
function mostrarProducto() {
    if (datos.length === 0) {
        alert("No hay productos cargados");
        return;
    }
    mostrarEnPantalla(datos, 'productos');
}

//Mostrar los productos 
function mostrarEnPantalla(productos, elementoId) {
    let listaProductos = document.getElementById(elementoId);
    listaProductos.innerHTML = '';

    productos.forEach((producto, index) => {
        let item = document.createElement('section');
        item.className = 'productoI';
        item.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>${producto.marca}</p>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: ${producto.cantidad}</p>
            <p>Vencimiento: ${producto.vencimiento}</p>
            <div>
                <button class="productoBoton" onclick="agregarAlCarrito('${producto.nombre}')">Agregar al carrito</button>
                <button class="lapizEdicion" onclick="editarProducto(${index})">
                    <img class= "logoLapiz" src="logolapiz.png" alt="Editar">
                </button>
            </div>
        `;
        listaProductos.appendChild(item);
    });
}
//Editar producto
function editarProducto(index) {
    let producto = datos[index];
    let nuevoNombre = prompt("Nuevo nombre para el producto:", producto.nombre);
    let nuevaMarca = prompt("Nueva marca del producto:", producto.marca);
    let nuevoPrecio = parseFloat(prompt("Nuevo precio del producto (solo números):", producto.precio));
    let nuevaCantidad = parseInt(prompt("Cantidad del producto (solo números):", producto.cantidad));
    let nuevaFechaVencimiento = prompt("Fecha de vencimiento:", producto.vencimiento);

    if (isNaN(nuevoPrecio) || isNaN(nuevaCantidad)) {
        alert("Solo números, por favor");
        return;
    }

    producto.nombre = nuevoNombre;
    producto.marca = nuevaMarca;
    producto.precio = nuevoPrecio;
    producto.cantidad = nuevaCantidad;
    producto.vencimiento = nuevaFechaVencimiento;

    localStorage.setItem('productos', JSON.stringify(datos));
    mostrarProducto();
}
//Productos al carrito 
function agregarAlCarrito(nombreProducto) {
    let producto = datos.find(producto => producto.nombre.toLowerCase() === nombreProducto.toLowerCase());

    if (producto && producto.cantidad > 0) {
        let productoCarrito = carrito.find(item => item.nombre.toLowerCase() === producto.nombre.toLowerCase());

        if (productoCarrito) {
            productoCarrito.cantidad += 1;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        producto.cantidad -= 1;
        localStorage.setItem('productos', JSON.stringify(datos));
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    } else {
        alert("No hay stock disponible de este producto");
    }
}
//carrito de ventas
function mostrarCarrito() {
    let carritoElement = document.getElementById('ventaProductos'); 
    carritoElement.innerHTML = '';

    if (carrito.length === 0) {
        document.getElementById('carritoVacio').style.display = 'block';
        return;
    } else {
        document.getElementById('carritoVacio').style.display = 'none';
    }

    carrito.forEach((producto, index) => {
        let item = document.createElement('div');
        item.className = 'ventaProducto';
        item.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>${producto.marca}</p>
            <p>$${producto.precio}</p>
            <p>Cantidad: 
                <button onclick="actualizarCantidad(${index}, -1)">-</button>
                ${producto.cantidad}
                <button onclick="actualizarCantidad(${index}, 1)">+</button>
            </p>
            <button class="BotonVP" onclick="eliminarDelCarrito(${index})">X</button>
        `;
        carritoElement.appendChild(item);
    });
    actualizarTotal();
}
//Productos en el carrito
function actualizarCantidad(index, cambio) {
    let productoCarrito = carrito[index];
    let productoOriginal = datos.find(p => p.nombre.toLowerCase() === productoCarrito.nombre.toLowerCase());

    if (productoOriginal) {
        productoCarrito.cantidad += cambio;
        productoOriginal.cantidad -= cambio;
        if (productoCarrito.cantidad <= 0) {
            carrito.splice(index, 1);
        }
        if (productoOriginal.cantidad < 0) {
            productoOriginal.cantidad = 0;
        }
        localStorage.setItem('productos', JSON.stringify(datos));
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
}
//Eliminar producto del carrito
function eliminarDelCarrito(index) {
    let productoCarrito = carrito[index];
    let productoOriginal = datos.find(p => p.nombre.toLowerCase() === productoCarrito.nombre.toLowerCase());

    if (productoOriginal) {
        productoOriginal.cantidad += productoCarrito.cantidad;
        carrito.splice(index, 1);

        localStorage.setItem('productos', JSON.stringify(datos));
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
}
//Actualizar el total del carrito
function actualizarTotal() {
    let total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

//Confirmar venta y guardarla en historial
function confirmarVenta() {
    if (carrito.length === 0) {
        alert("Carrito vacío");
        return;
    }
    ventas.push({
        fecha: new Date().toLocaleDateString(),
        productos: carrito.slice()
    });

    localStorage.setItem('ventas', JSON.stringify(ventas));
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    alert("Venta confirmada");
}
//Mostrar ventas realizadas
function verVentas() {
    if (ventas.length === 0) {
        alert("No hay ventas realizadas");
        return;
    }

    let ventasHtml = ventas.map((venta, index) => `
        <div class="ventaBox">
            <h3>Venta #${index + 1}</h3>
            <p>Fecha: ${venta.fecha}</p>
            <ul>
                ${venta.productos.map(p => `
                    <li>${p.nombre} - ${p.cantidad} x $${p.precio}</li>
                `).join('')}
            </ul>
            <p>Total: $${venta.productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0)}</p>
        </div>
    `).join('');

    document.getElementById('productos').innerHTML = ventasHtml;
}
