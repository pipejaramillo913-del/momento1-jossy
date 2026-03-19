// ============================================================
//  CESDE PARKING SYSTEM — VehiculosAdm.js  (localStorage version)
// ============================================================

verificarRol(["Administrador"]);

const Crear          = document.getElementById("btn-crearVehiculo");
const mensaje        = document.getElementById("mensaje");
const cedula         = document.getElementById("cedula");
const placa          = document.getElementById("placa");
const marca          = document.getElementById("marca");
const modelo         = document.getElementById("modelo");
const color          = document.getElementById("color");
const tipo           = document.getElementById("tipo");
const tbodyVehiculos = document.getElementById("tbodyVehiculos");

document.addEventListener("DOMContentLoaded", () => {
    mostrarTablaVehiculos();

    const btnCerrarSesion = document.getElementById("cerrarSesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", e => { e.preventDefault(); cerrarSesionDirecto(); });
        btnCerrarSesion.style.cursor = "pointer";
    }
});

Crear.addEventListener("click", crearNuevoVehiculo);

// ---------------------- CREAR ----------------------
function crearNuevoVehiculo() {
    if (!cedula.value || !placa.value || !marca.value || !modelo.value || !color.value || !tipo.value) {
        showMsg("Todos los campos son obligatorios", false);
        return;
    }

    const vehiculos = getVehiculos();

    if (vehiculos.some(v => v.placa === placa.value.trim().toUpperCase())) {
        showMsg("Ya existe un vehículo con esta placa", false);
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (!usuarios.some(u => u.documento === cedula.value.trim())) {
        showMsg("No existe un usuario con esa cédula", false);
        return;
    }

    vehiculos.push({
        documento: cedula.value.trim(),
        placa:     placa.value.trim().toUpperCase(),
        marca:     marca.value.trim(),
        modelo:    modelo.value.trim(),
        color:     color.value.trim(),
        tipo:      tipo.value
    });

    saveVehiculos(vehiculos);
    showMsg("Vehículo registrado exitosamente", true);
    limpiarFormulario();
    mostrarTablaVehiculos();
}

// ---------------------- LISTAR ----------------------
function mostrarTablaVehiculos() {
    const vehiculos = getVehiculos();
    tbodyVehiculos.innerHTML = "";

    vehiculos.forEach(v => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${v.documento}</td>
            <td>${v.placa}</td>
            <td>${v.marca}</td>
            <td>${v.modelo}</td>
            <td>${v.color}</td>
            <td>${v.tipo}</td>
            <td>
                <i class="bi bi-arrow-repeat icon" style="cursor:pointer;" onclick="editarVehiculo('${v.placa}')"></i>
                <i class="bi bi-trash icon" style="cursor:pointer;" onclick="eliminarVehiculo('${v.placa}')"></i>
            </td>
        `;
        tbodyVehiculos.appendChild(fila);
    });
}

// ---------------------- ELIMINAR ----------------------
function eliminarVehiculo(placaVeh) {
    mensaje.innerHTML = `
        <span>¿Eliminar vehículo <b>${placaVeh}</b>?</span>
        <button id="btnSi" class="btn-crearUsuario">Sí</button>
        <button id="btnNo" class="btn-crearUsuario">No</button>
    `;

    document.getElementById("btnSi").addEventListener("click", () => {
        const nuevos = getVehiculos().filter(v => v.placa !== placaVeh);
        saveVehiculos(nuevos);
        mostrarTablaVehiculos();
        showMsg("Vehículo eliminado exitosamente", true);
    });

    document.getElementById("btnNo").addEventListener("click", () => {
        showMsg("Cancelado", false);
    });
}

// ---------------------- EDITAR ----------------------
function editarVehiculo(placaVeh) {
    const vehiculos = getVehiculos();
    const index     = vehiculos.findIndex(v => v.placa === placaVeh);
    if (index === -1) return;

    const v = vehiculos[index];

    cedula.value  = v.documento;
    placa.value   = v.placa;
    marca.value   = v.marca;
    modelo.value  = v.modelo;
    color.value   = v.color;
    tipo.value    = v.tipo;

    Crear.textContent = "Actualizar";
    Crear.removeEventListener("click", crearNuevoVehiculo);

    function guardarCambios() {
        vehiculos[index].documento = cedula.value.trim();
        vehiculos[index].placa     = placa.value.trim().toUpperCase();
        vehiculos[index].marca     = marca.value.trim();
        vehiculos[index].modelo    = modelo.value.trim();
        vehiculos[index].color     = color.value.trim();
        vehiculos[index].tipo      = tipo.value;

        saveVehiculos(vehiculos);
        mostrarTablaVehiculos();
        limpiarFormulario();

        Crear.textContent = "Registrar";
        Crear.removeEventListener("click", guardarCambios);
        Crear.addEventListener("click", crearNuevoVehiculo);

        showMsg("Vehículo actualizado exitosamente", true);
    }

    Crear.addEventListener("click", guardarCambios);
}

// ---------------------- UTILIDADES ----------------------
function getVehiculos()     { return JSON.parse(localStorage.getItem("vehiculos")) || []; }
function saveVehiculos(arr) { localStorage.setItem("vehiculos", JSON.stringify(arr)); }

function limpiarFormulario() {
    cedula.value  = "";
    placa.value   = "";
    marca.value   = "";
    modelo.value  = "";
    color.value   = "";
    tipo.value    = "Carro";
}

function showMsg(texto, ok) {
    mensaje.innerHTML = `<span style="color:${ok ? '#28a745' : '#e71d73'};">${texto}</span>`;
    setTimeout(() => mensaje.innerHTML = "", 2500);
}
