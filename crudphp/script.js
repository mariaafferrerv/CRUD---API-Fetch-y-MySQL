const form = document.getElementById("formProducto");
const btnGuardar = document.getElementById("btnGuardar");
const btnNuevo = document.getElementById("btnNuevo");
const txtBuscar = document.getElementById("txtBuscar");
const btnBuscar = document.getElementById("btnBuscar");
const tbody = document.querySelector("#tablaProductos tbody");

// Cuando carga la página, listar productos
document.addEventListener("DOMContentLoaded", () => {
    listarProductos();
});

// Enviar formulario (Guardar o Modificar)
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Si hay id => Modificar, si no => Guardar
    let accion = document.getElementById("id").value ? "Modificar" : "Guardar";
    formData.append("Accion", accion);

    fetch("registrar.php", {
        method: "POST",
        body: formData
    })
    .then(r => r.json())
    .then(data => manejarRespuesta(data))
    .catch(err => {
        console.error(err);
        Swal.fire("Error", "Error de red o del servidor", "error");
    });
});

// Botón Nuevo -> limpia el formulario
btnNuevo.addEventListener("click", () => {
    form.reset();
    document.getElementById("id").value = "";
    btnGuardar.textContent = "Guardar";
});

// Botón Buscar
btnBuscar.addEventListener("click", () => {
    buscarProductos();
});

// Buscar al presionar Enter dentro del input
txtBuscar.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        buscarProductos();
    }
});

function buscarProductos() {
    const texto = txtBuscar.value.trim();

    const formData = new FormData();
    formData.append("Accion", "Buscar");
    formData.append("texto", texto);

    fetch("registrar.php", {
        method: "POST",
        body: formData
    })
    .then(r => r.json())
    .then(data => manejarRespuesta(data))
    .catch(err => {
        console.error(err);
        Swal.fire("Error", "Error de red o del servidor", "error");
    });
}

function listarProductos() {
    const formData = new FormData();
    formData.append("Accion", "Listar");

    fetch("registrar.php", {
        method: "POST",
        body: formData
    })
    .then(r => r.json())
    .then(data => manejarRespuesta(data))
    .catch(err => {
        console.error(err);
        Swal.fire("Error", "Error al listar productos", "error");
    });
}

// Maneja TODAS las respuestas del servidor con un switch
function manejarRespuesta(data) {
    // data: {success, message, errors?, data?, accion}

    switch (data.accion) {
        case "Guardar":
        case "Modificar":
            if (data.success) {
                Swal.fire("Éxito", data.message, "success");
                form.reset();
                document.getElementById("id").value = "";
                btnGuardar.textContent = "Guardar";
                listarProductos();
            } else {
                let msg = data.message || "Error al guardar/modificar.";
                if (data.errors) {
                    msg += "\n" + Object.values(data.errors).join("\n");
                }
                Swal.fire("Error", msg, "error");
            }
            break;

        case "Listar":
        case "Buscar":
            if (data.success) {
                pintarTabla(data.data);
            } else {
                Swal.fire("Error", data.message || "Error al obtener productos", "error");
            }
            break;

        case "Obtener":
            if (data.success) {
                llenarFormulario(data.data);
            } else {
                Swal.fire("Error", data.message || "Producto no encontrado", "error");
            }
            break;

        default:
            if (data.message) {
                Swal.fire("Aviso", data.message, "info");
            }
            break;
    }
}

function pintarTabla(lista) {
    tbody.innerHTML = "";

    lista.forEach(prod => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${prod.id}</td>
            <td>${prod.codigo}</td>
            <td>${prod.producto}</td>
            <td>${prod.precio}</td>
            <td>${prod.cantidad}</td>
            <td>
                <button class="btn btn-sm btn-warning btn-editar" data-id="${prod.id}">
                    Editar
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// Delegación de evento para botón Editar
tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-editar")) {
        const id = e.target.getAttribute("data-id");
        obtenerProducto(id);
    }
});

function obtenerProducto(id) {
    const formData = new FormData();
    formData.append("Accion", "Obtener");
    formData.append("id", id);

    fetch("registrar.php", {
        method: "POST",
        body: formData
    })
    .then(r => r.json())
    .then(data => manejarRespuesta(data))
    .catch(err => {
        console.error(err);
        Swal.fire("Error", "Error al obtener producto", "error");
    });
}

function llenarFormulario(prod) {
    document.getElementById("id").value = prod.id;
    document.getElementById("codigo").value = prod.codigo;
    document.getElementById("producto").value = prod.producto;
    document.getElementById("precio").value = prod.precio;
    document.getElementById("cantidad").value = prod.cantidad;

    btnGuardar.textContent = "Modificar";
}
