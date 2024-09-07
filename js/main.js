document.addEventListener('DOMContentLoaded', async () => {
    await cargarProductos();
});

let datos = JSON.parse(localStorage.getItem('productos')) || [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let ventas = JSON.parse(localStorage.getItem('ventas')) || [];

// Datos
async function crearProducto() {
    const { value: producto } = await Swal.fire({
        title: 'Agregar Producto',
        html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre">
            <input id="marca" class="swal2-input" placeholder="Marca">
            <input id="precio" class="swal2-input" type="number" placeholder="Precio" step="0.01">
            <input id="cantidad" class="swal2-input" type="number" placeholder="Cantidad" min="1">
            <input id="vencimiento" class="swal2-input" placeholder="Fecha de Vencimiento (dd-mm-yyyy)">
        `,
        focusConfirm: false,
        confirmButtonText: 'Agregar',
        preConfirm: () => {
            return {
                nombre: document.getElementById('nombre').value,
                marca: document.getElementById('marca').value,
                precio: parseFloat(document.getElementById('precio').value),
                cantidad: parseInt(document.getElementById('cantidad').value),
                vencimiento: document.getElementById('vencimiento').value
            };
        }
    });

    if (producto) {
        if (producto.nombre === '' || producto.marca === '' || isNaN(producto.precio) || isNaN(producto.cantidad) || producto.cantidad <= 0 || producto.vencimiento === '') {
            Swal.fire('Error', 'Por favor complete todos los campos correctamente', 'error');
            return;
        }

        // Agregar producto
        datos.push(producto);
        localStorage.setItem('productos', JSON.stringify(datos));
        Swal.fire('Éxito', 'Producto agregado', 'success');

        mostrarProducto();
    }
}

// Buscar un producto
async function buscarProducto() {
    const { value: busqueda } = await Swal.fire({
        title: 'Buscar Producto',
        input: 'text',
        inputPlaceholder: 'Escribe el nombre del producto',
        inputAttributes: {
            'aria-label': 'Escribe el nombre del producto'
        },
        confirmButtonText: 'Buscar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
    });

    if (busqueda) {
        let resultado = datos.filter(producto => producto.nombre.toLowerCase() === busqueda.toLowerCase());

        if (resultado.length > 0) {
            // Mostrar los productos encontrados
            mostrarEnPantalla(resultado, 'productos');
            Swal.fire({
                title: `Encontré ${resultado.length} producto(s)`,
                text: resultado.map(p => `${p.nombre} - ${p.marca} - $${p.precio}`).join('\n'),
                icon: 'info'
            });
        } else {
            Swal.fire('No hay stock', 'No se encontraron productos con ese nombre', 'info');
        }
    }
}

// Productos JSON
async function cargarProductos() {
    try {
        const response = await fetch('productos.json');
        if (!response.ok) throw new Error('Error al cargar los productos');
        datos = await response.json();
        localStorage.setItem('productos', JSON.stringify(datos));
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
    }
}

function mostrarProducto() {
    if (datos.length === 0) {
        Swal.fire('No hay productos', 'No hay productos cargados', 'info');
        return;
    }
    mostrarEnPantalla(datos, 'productos');
}

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
    let producto = datos[index];
    const { value: nuevoNombre } = await Swal.fire({
        title: 'Nuevo nombre para el producto:',
        input: 'text',
        inputValue: producto.nombre
    });

    const { value: nuevaMarca } = await Swal.fire({
        title: 'Nueva marca del producto:',
        input: 'text',
        inputValue: producto.marca
    });

    const { value: nuevoPrecio } = await Swal.fire({
        title: 'Nuevo precio del producto (solo números):',
        input: 'text',
        inputValue: producto.precio
    });

    const { value: nuevaCantidad } = await Swal.fire({
        title: 'Cantidad del producto (solo números):',
        input: 'text',
        inputValue: producto.cantidad
    });

    const { value: nuevaFechaVencimiento } = await Swal.fire({
        title: 'Fecha de vencimiento:',
        input: 'text',
        inputValue: producto.vencimiento
    });

    let parsedPrecio = parseFloat(nuevoPrecio.replace(/[^0-9.]/g, ''));
    let parsedCantidad = parseInt(nuevaCantidad.replace(/[^0-9]/g, ''));

    if (isNaN(parsedPrecio) || isNaN(parsedCantidad)) {
        Swal.fire('Error', 'Solo números, por favor', 'error');
        return;
    }

    datos[index] = {
        nombre: nuevoNombre,
        marca: nuevaMarca,
        precio: parsedPrecio,
        cantidad: parsedCantidad,
        vencimiento: nuevaFechaVencimiento
    };

    localStorage.setItem('productos', JSON.stringify(datos));
    Toastify({
        text: "Producto actualizado",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#4CAF50",
    }).showToast();
    mostrarProducto();
}

// Productos al carrito 
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
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        carritoElement.appendChild(item);
    });

    actualizarTotal();
}

function actualizarCantidad(index, cambio) {
    let producto = carrito[index];
    if (producto) {
        let nuevoCantidad = producto.cantidad + cambio;
        if (nuevoCantidad <= 0) {
            eliminarDelCarrito(index);
        } else {
            producto.cantidad = nuevoCantidad;
            carrito[index] = producto;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito();
        }
    }
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function actualizarTotal() {
    let total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

//Confirmar la venta
function confirmarVenta() {
    if (carrito.length === 0) {
        Swal.fire('Carrito vacío', 'No puedes hacer una venta con el carrito vacío', 'info');
        return;
    }

    const fecha = new Date().toLocaleDateString();
    const totalVenta = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);

    ventas.push({
        fecha: fecha,
        total: totalVenta,
        productos: carrito.map(p => ({ nombre: p.nombre, cantidad: p.cantidad, precio: p.precio }))
    });

    localStorage.setItem('ventas', JSON.stringify(ventas));
    localStorage.removeItem('carrito');
    carrito = [];

    Swal.fire('Venta confirmada', `Total de la venta: $${totalVenta.toFixed(2)}`, 'success');

}

// Ver ventas
function verVentas() {
    // Verificar si 'ventas' es un array
    if (!Array.isArray(ventas)) {
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema con el formato de las ventas.',
            icon: 'error'
        });
        return;
    }

    // Verificar si el array de ventas tiene elementos
    if (ventas.length === 0) {
        Swal.fire({
            title: 'No hay ventas realizadas',
            icon: 'info'
        });
        return;
    }

    mostrarVentas();
}

// Mostrar ventas
function mostrarVentas() {
    let ventasHTML = '';

    // Recorrer las ventas y construir el HTML
    ventas.forEach((venta, index) => {
        ventasHTML += `
            <div class="ventaItem">
                <h4>Venta ${index + 1}</h4>
                <p>Fecha: ${venta.fecha}</p>
                <p>Total: $${venta.total.toFixed(2)}</p>
                <div>
                    ${venta.productos.map(p => `
                        <p>${p.nombre} - $${p.precio.toFixed(2)} x ${p.cantidad}</p>
                    `).join('')}
                </div>
            </div>
        `;
    });

    // Mostrar ventas en un modal usando SweetAlert
    Swal.fire({
        title: 'Ventas Realizadas',
        html: ventasHTML,
        width: '600px',
        showCloseButton: true
    });
}
