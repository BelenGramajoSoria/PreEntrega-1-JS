// Importar librerías (en un proyecto real, usa un gestor de paquetes o incluye los scripts en el HTML)
import Swal from 'sweetalert2';
import Toastify from 'toastify-js';

// Datos
let datos = JSON.parse(localStorage.getItem('productos')) || [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let ventas = JSON.parse(localStorage.getItem('ventas')) || [];

// Datos iniciales
const datosIniciales = [
    { nombre: 'Producto1', marca: 'Marca1', precio: 100, cantidad: 10, vencimiento: '2024-12-31' },
    { nombre: 'Producto2', marca: 'Marca2', precio: 200, cantidad: 5, vencimiento: '2024-11-30' },
];
if (datos.length === 0) {
    datos = datosIniciales;
    localStorage.setItem('productos', JSON.stringify(datos));
}

// Crear producto
async function crearProducto() {
    try {
        const { value: nombre } = await Swal.fire({
            title: 'Escribí el nombre del producto:',
            input: 'text',
            inputLabel: 'Nombre',
            inputPlaceholder: 'Nombre del producto',
        });
        const { value: marca } = await Swal.fire({
            title: 'Marca del producto',
            input: 'text',
            inputLabel: 'Marca',
            inputPlaceholder: 'Marca del producto',
        });
        const { value: precio } = await Swal.fire({
            title: 'Precio del producto (solo números)',
            input: 'text',
            inputLabel: 'Precio',
            inputPlaceholder: 'Precio del producto',
            inputValidator: (value) => {
                if (isNaN(value)) return 'Solo números, por favor';
            }
        });
        const { value: cantidad } = await Swal.fire({
            title: 'Cantidad de producto en stock (solo números)',
            input: 'text',
            inputLabel: 'Cantidad',
            inputPlaceholder: 'Cantidad en stock',
            inputValidator: (value) => {
                if (isNaN(value)) return 'Solo números, por favor';
            }
        });
        const { value: vencimiento } = await Swal.fire({
            title: 'Cuál es la fecha de vencimiento?',
            input: 'text',
            inputLabel: 'Vencimiento',
            inputPlaceholder: 'Fecha de vencimiento',
        });

        if (nombre && marca && !isNaN(precio) && !isNaN(cantidad) && vencimiento) {
            let producto = { nombre, marca, precio: parseFloat(precio), cantidad: parseInt(cantidad), vencimiento };
            datos.push(producto);
            localStorage.setItem('productos', JSON.stringify(datos));
            Toastify({ text: "Producto agregado", duration: 3000 }).showToast();
            mostrarProducto();
        }
    } catch (error) {
        console.error("Error al crear producto:", error);
    }
}

// Buscar un producto
async function buscarProducto() {
    try {
        const { value: busqueda } = await Swal.fire({
            title: '¿Qué producto buscas?',
            input: 'text',
            inputLabel: 'Buscar producto',
            inputPlaceholder: 'Nombre del producto',
        });

        if (busqueda) {
            let resultado = datos.filter(producto => producto.nombre.toLowerCase() === busqueda.toLowerCase());

            if (resultado.length > 0) {
                mostrarEnPantalla(resultado, 'productos');
                Swal.fire(`Encontré ${resultado.length}`);
            } else {
                Swal.fire("No hay stock");
            }
        }
    } catch (error) {
        console.error("Error al buscar producto:", error);
    }
}

// Lista de productos cargados
async function mostrarProducto() {
    try {
        if (datos.length === 0) {
            Swal.fire("No hay productos cargados");
            return;
        }
        mostrarEnPantalla(datos, 'productos');
    } catch (error) {
        console.error("Error al mostrar productos:", error);
    }
}

// Mostrar los productos
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
                    <img class="logoLapiz" src="logolapiz.png" alt="Editar">
                </button>
            </div>
        `;
        listaProductos.appendChild(item);
    });
}

// Editar producto
async function editarProducto(index) {
    try {
        let producto = datos[index];
        const { value: nuevoNombre } = await Swal.fire({
            title: 'Nuevo nombre para el producto:',
            input: 'text',
            inputLabel: 'Nombre',
            inputValue: producto.nombre,
        });
        const { value: nuevaMarca } = await Swal.fire({
            title: 'Nueva marca del producto:',
            input: 'text',
            inputLabel: 'Marca',
            inputValue: producto.marca,
        });
        const { value: nuevoPrecio } = await Swal.fire({
            title: 'Nuevo precio del producto (solo números):',
            input: 'text',
            inputLabel: 'Precio',
            inputValue: producto.precio,
            inputValidator: (value) => {
                if (isNaN(value)) return 'Solo números, por favor';
            }
        });
        const { value: nuevaCantidad } = await Swal.fire({
            title: 'Nueva cantidad del producto (solo números):',
            input: 'text',
            inputLabel: 'Cantidad',
            inputValue: producto.cantidad,
            inputValidator: (value) => {
                if (isNaN(value)) return 'Solo números, por favor';
            }
        });
        const { value: nuevaFechaVencimiento } = await Swal.fire({
            title: 'Nueva fecha de vencimiento:',
            input: 'text',
            inputLabel: 'Vencimiento',
            inputValue: producto.vencimiento,
        });

        if (nuevoNombre && nuevaMarca && !isNaN(nuevoPrecio) && !isNaN(nuevaCantidad) && nuevaFechaVencimiento) {
            producto.nombre = nuevoNombre;
            producto.marca = nuevaMarca;
            producto.precio = parseFloat(nuevoPrecio);
            producto.cantidad = parseInt(nuevaCantidad);
            producto.vencimiento = nuevaFechaVencimiento;

            localStorage.setItem('productos', JSON.stringify(datos));
            mostrarProducto();
        }
    } catch (error) {
        console.error("Error al editar producto:", error);
    }
}

// Agregar al carrito
async function agregarAlCarrito(nombreProducto) {
    try {
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
            Toastify({ text: "Producto agregado al carrito", duration: 3000 }).showToast();
        } else {
            Swal.fire("No hay stock disponible de este producto");
        }
    } catch (error) {
        console.error("Error al agregar al carrito:", error);
    }
}

// Mostrar carrito
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

// Actualizar cantidad
function actualizarCantidad(index, cambio) {
    let productoCarrito = carrito[index];
    if (productoCarrito) {
        if (cambio < 0 && productoCarrito.cantidad > 1) {
            productoCarrito.cantidad += cambio;
        } else if (cambio > 0) {
            let productoOriginal = datos.find(producto => producto.nombre.toLowerCase() === productoCarrito.nombre.toLowerCase());
            if (productoOriginal && productoOriginal.cantidad > 0) {
                productoCarrito.cantidad += cambio;
                productoOriginal.cantidad -= cambio;
            }
        }
        localStorage.setItem('productos', JSON.stringify(datos));
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
}

// Eliminar del carrito
function eliminarDelCarrito(index) {
    let productoCarrito = carrito[index];
    if (productoCarrito) {
        let productoOriginal = datos.find(producto => producto.nombre.toLowerCase() === productoCarrito.nombre.toLowerCase());
        if (productoOriginal) {
            productoOriginal.cantidad += productoCarrito.cantidad;
        }
        carrito.splice(index, 1);
        localStorage.setItem('productos', JSON.stringify(datos));
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
}

// Generar venta
async function generarVenta() {
    try {
        if (carrito.length === 0) {
            Swal.fire("No hay productos en el carrito");
            return;
        }
        const { value: nombreCliente } = await Swal.fire({
            title: 'Nombre del cliente',
            input: 'text',
            inputLabel: 'Nombre del cliente',
        });
        if (!nombreCliente) {
            Swal.fire("Nombre del cliente es requerido");
            return;
        }
        let total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
        ventas.push({
            nombreCliente,
            productos: [...carrito],
            total,
            fecha: new Date().toLocaleDateString(),
        });
        localStorage.setItem('ventas', JSON.stringify(ventas));
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
        Swal.fire(`Venta generada. Total: $${total}`);
    } catch (error) {
        console.error("Error al generar venta:", error);
    }
}

// Buscar ventas
async function buscarVentas() {
    try {
        const { value: nombreCliente } = await Swal.fire({
            title: 'Buscar ventas por cliente',
            input: 'text',
            inputLabel: 'Nombre del cliente',
        });
        if (!nombreCliente) {
            Swal.fire("Nombre del cliente es requerido");
            return;
        }
        let ventasCliente = ventas.filter(venta => venta.nombreCliente.toLowerCase() === nombreCliente.toLowerCase());
        if (ventasCliente.length > 0) {
            mostrarEnPantalla(ventasCliente, 'ventas');
            Swal.fire(`Encontré ${ventasCliente.length} ventas`);
        } else {
            Swal.fire("No se encontraron ventas para este cliente");
        }
    } catch (error) {
        console.error("Error al buscar ventas:", error);
    }
}

// Mostrar ventas
function mostrarVentas() {
    let ventasElement = document.getElementById('ventas');
    ventasElement.innerHTML = '';

    if (ventas.length === 0) {
        Swal.fire("No hay ventas registradas");
        return;
    }

    ventas.forEach((venta, index) => {
        let item = document.createElement('div');
        item.className = 'venta';
        item.innerHTML = `
            <h3>Venta ${index + 1}</h3>
            <p>Cliente: ${venta.nombreCliente}</p>
            <p>Total: $${venta.total}</p>
            <p>Fecha: ${venta.fecha}</p>
            <h4>Productos:</h4>
            <ul>
                ${venta.productos.map(p => `<li>${p.nombre} - ${p.cantidad} x $${p.precio}</li>`).join('')}
            </ul>
        `;
        ventasElement.appendChild(item);
    });
}

// Eventos
document.getElementById('crearProducto').addEventListener('click', crearProducto);
document.getElementById('buscarProducto').addEventListener('click', buscarProducto);
document.getElementById('mostrarProductos').addEventListener('click', mostrarProducto);
document.getElementById('generarVenta').addEventListener('click', generarVenta);
document.getElementById('buscarVentas').addEventListener('click', buscarVentas);
document.getElementById('mostrarVentas').addEventListener('click', mostrarVentas);

// Inicializar pantalla
mostrarProducto();
mostrarCarrito();
