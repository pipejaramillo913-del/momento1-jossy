// ============================================================
//  CESDE PARKING SYSTEM — VehiculoUsuarios.js  (localStorage version)
// ============================================================

const editarDatos       = document.getElementById("editarDatos");
const btnAgregarVehiculo = document.getElementById("agregarVehiculo");
const btnRegistrar      = document.getElementById("registrar");
const btnCancelar       = document.getElementById("cancelar");

const inputPlaca  = document.getElementById("placa");
const inputMarca  = document.getElementById("marca");
const inputModelo = document.getElementById("modelo");
const inputColor  = document.getElementById("color");
const inputTipo   = document.getElementById("tipo");

const tbodyVehiculos  = document.getElementById("tbodyVehiculos");
const btnCerrarSesion = document.getElementById("cerrarSesion");

let usuarioActual = null;
let modoEdicion   = false;
let placaOriginal = null;

document.addEventListener("DOMContentLoaded", () => {
    verificarRol(["Estudiante"]);

    usuarioActual = obtenerUsuarioActual();
    if (!usuarioActual) { window.location.href = "/Frontend/html/login.html"; return; }

    cargarVehiculos();
    configurarEventos();
});

// ---------------------- CARGAR ----------------------
function cargarVehiculos() {
    const vehiculos      = getVehiculos();
    const misVehiculos   = vehiculos.filter(v => v.documento === usuarioActual.documento);
    mostrarVehiculos(misVehiculos);
}

function mostrarVehiculos(vehiculos) {
    tbodyVehiculos.innerHTML = "";

    if (vehiculos.length === 0) {
        tbodyVehiculos.innerHTML = `
            <tr><td colspan="6" style="padding:20px;color:#666;">No tienes vehículos registrados</td></tr>
        `;
        return;
    }

    vehiculos.forEach(v => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${v.placa}</td>
            <td>${v.marca}</td>
            <td>${v.modelo}</td>
            <td>${v.color}</td>
            <td>${v.tipo}</td>
            <td>
                <i class="bi bi-arrow-repeat icon" style="cursor:pointer;font-size:18px;margin-right:10px;" onclick="editarVehiculo('${v.placa}')"></i>
                <i class="bi bi-trash icon" style="cursor:pointer;font-size:18px;" onclick="eliminarVehiculo('${v.placa}')"></i>
            </td>
        `;
        tbodyVehiculos.appendChild(fila);
    });
}

// ---------------------- EVENTOS ----------------------
function configurarEventos() {
    if (btnAgregarVehiculo) btnAgregarVehiculo.addEventListener("click", mostrarFormularioRegistro);
    if (btnCancelar)        btnCancelar.addEventListener("click", cancelarFormulario);
    if (btnRegistrar)       btnRegistrar.addEventListener("click", () => {
        modoEdicion ? actualizarVehiculo() : registrarVehiculo();
    });
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", e => { e.preventDefault(); cerrarSesionDirecto(); });
        btnCerrarSesion.style.cursor = "pointer";
    }
}

function mostrarFormularioRegistro() {
    modoEdicion = false; placaOriginal = null;
    limpiarFormulario();
    btnRegistrar.textContent            = "Registrar";
    editarDatos.style.display           = "flex";
    btnAgregarVehiculo.style.display    = "none";
}

function cancelarFormulario() {
    modoEdicion = false; placaOriginal = null;
    limpiarFormulario();
    const el = document.getElementById("mensaje");
    if (el) el.textContent = "";
    editarDatos.style.display        = "none";
    btnAgregarVehiculo.style.display = "block";
}

// ---------------------- REGISTRAR ----------------------
function registrarVehiculo() {
    const placa  = inputPlaca.value.trim().toUpperCase();
    const marca  = inputMarca.value.trim();
    const modelo = inputModelo.value.trim();
    const color  = inputColor.value.trim();
    const tipo   = inputTipo.value;

    if (!placa || !marca || !modelo || !color) { showMsg("Todos los campos son obligatorios", false); return; }
    if (placa.length !== 6) { showMsg("La placa debe tener 6 caracteres", false); return; }

    const vehiculos = getVehiculos();
    if (vehiculos.some(v => v.placa === placa)) { showMsg("Ya existe un vehículo con esta placa", false); return; }

    vehiculos.push({ documento: usuarioActual.documento, placa, marca, modelo, color, tipo });
    saveVehiculos(vehiculos);

    showMsg("Vehículo registrado correctamente", true);
    cargarVehiculos();
    setTimeout(cancelarFormulario, 1500);
}

// ---------------------- EDITAR ----------------------
function editarVehiculo(placa) {
    const vehiculos = getVehiculos();
    const v         = vehiculos.find(v => v.placa === placa);
    if (!v || v.documento !== usuarioActual.documento) {
        showMsg("No tienes permisos para editar este vehículo", false);
        return;
    }

    modoEdicion   = true;
    placaOriginal = placa;

    inputPlaca.value  = v.placa;
    inputMarca.value  = v.marca;
    inputModelo.value = v.modelo;
    inputColor.value  = v.color;
    inputTipo.value   = v.tipo;

    btnRegistrar.textContent         = "Actualizar";
    editarDatos.style.display        = "flex";
    btnAgregarVehiculo.style.display = "none";
}

function actualizarVehiculo() {
    const placa  = inputPlaca.value.trim().toUpperCase();
    const marca  = inputMarca.value.trim();
    const modelo = inputModelo.value.trim();
    const color  = inputColor.value.trim();
    const tipo   = inputTipo.value;

    if (!placa || !marca || !modelo || !color) { showMsg("Todos los campos son obligatorios", false); return; }
    if (placa.length !== 6) { showMsg("La placa debe tener 6 caracteres", false); return; }

    const vehiculos = getVehiculos();
    const idx       = vehiculos.findIndex(v => v.placa === placaOriginal);
    if (idx === -1) return;

    vehiculos[idx] = { ...vehiculos[idx], placa, marca, modelo, color, tipo };
    saveVehiculos(vehiculos);

    showMsg("Vehículo actualizado correctamente", true);
    cargarVehiculos();
    setTimeout(cancelarFormulario, 1500);
}

// ---------------------- ELIMINAR ----------------------
function eliminarVehiculo(placaVeh) {
    const msg = document.getElementById("mensaje");
    if (msg) {
        msg.innerHTML = `
            <span style="color:black;">¿Eliminar vehículo <b>${placaVeh}</b>?</span>
            <button id="btnSi" class="btn">Sí</button>
            <button id="btnNo" class="btn">No</button>
        `;

        document.getElementById("btnSi").addEventListener("click", () => {
            const nuevos = getVehiculos().filter(v => v.placa !== placaVeh);
            saveVehiculos(nuevos);
            cargarVehiculos();
            showMsg("Vehículo eliminado", true);
        });

        document.getElementById("btnNo").addEventListener("click", () => {
            showMsg("Cancelado", false);
        });
    }
}

// ---------------------- UTILIDADES ----------------------
function getVehiculos()     { return JSON.parse(localStorage.getItem("vehiculos")) || []; }
function saveVehiculos(arr) { localStorage.setItem("vehiculos", JSON.stringify(arr)); }

function limpiarFormulario() {
    inputPlaca.value  = "";
    inputMarca.value  = "";
    inputModelo.value = "";
    inputColor.value  = "";
    inputTipo.value   = "Carro";
}

function showMsg(texto, ok) {
    const el = document.getElementById("mensaje");
    if (!el) return;
    el.style.color = ok ? "#28a745" : "#e71d73";
    el.textContent = texto;
    setTimeout(() => el.textContent = "", 3000);
}
