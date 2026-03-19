// ============================================================
//  CESDE PARKING SYSTEM — PerfilUsuarios.js  (localStorage version)
// ============================================================

const nombreU    = document.getElementById("nombreU");
const correoU    = document.getElementById("correoU");
const carreraName = document.getElementById("carreraName");
const ultimaPlaca = document.getElementById("ultimaPlaca");

const editarDatos         = document.getElementById("editarDatos");
const btnEditar           = document.getElementById("editar");
const btnGuardar          = document.getElementById("guardar");
const btnCancelar         = document.getElementById("cancelar");
const inputCorreo         = document.getElementById("correo");
const inputContrasenaActual = document.getElementById("contrasenaActual");
const inputContrasenaNueva  = document.getElementById("contrasenaNueva");

let usuarioActual = null;

document.addEventListener("DOMContentLoaded", () => {
    verificarRol(["Estudiante"]);

    usuarioActual = obtenerUsuarioActual();
    if (!usuarioActual) { window.location.href = "/Frontend/html/login.html"; return; }

    cargarDatos();
    configurarEventos();
});

function cargarDatos() {
    // Siempre leer desde localStorage para tener datos frescos
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const fresco   = usuarios.find(u => u.documento === usuarioActual.documento) || usuarioActual;

    // Actualizar referencia
    usuarioActual = fresco;
    localStorage.setItem("usuarioLogeado", JSON.stringify(fresco));

    if (nombreU)    nombreU.textContent   = fresco.nombre;
    if (correoU)    correoU.textContent   = fresco.correo;
    if (carreraName) carreraName.textContent = "Desarrollo de Software";

    // Último vehículo
    const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
    const misVehiculos = vehiculos.filter(v => v.documento === fresco.documento);
    if (ultimaPlaca) {
        ultimaPlaca.textContent = misVehiculos.length > 0
            ? misVehiculos[misVehiculos.length - 1].placa
            : "Sin vehículos";
    }
}

function configurarEventos() {
    if (btnEditar)   btnEditar.addEventListener("click", mostrarFormulario);
    if (btnCancelar) btnCancelar.addEventListener("click", cancelarEdicion);
    if (btnGuardar)  btnGuardar.addEventListener("click", guardarCambios);

    const btnCerrarSesion = document.getElementById("cerrarSesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", e => { e.preventDefault(); cerrarSesionDirecto(); });
        btnCerrarSesion.style.cursor = "pointer";
    }
}

function mostrarFormulario() {
    if (inputCorreo)           inputCorreo.value            = usuarioActual.correo;
    if (inputContrasenaActual) inputContrasenaActual.value  = "";
    if (inputContrasenaNueva)  inputContrasenaNueva.value   = "";
    if (editarDatos) editarDatos.style.display = "flex";
    if (btnEditar)   btnEditar.style.display   = "none";
}

function cancelarEdicion() {
    if (inputCorreo)           inputCorreo.value            = "";
    if (inputContrasenaActual) inputContrasenaActual.value  = "";
    if (inputContrasenaNueva)  inputContrasenaNueva.value   = "";
    if (editarDatos) editarDatos.style.display = "none";
    if (btnEditar)   btnEditar.style.display   = "block";
    const el = document.getElementById("mensaje");
    if (el) el.textContent = "";
}

function guardarCambios() {
    const nuevoCorreo      = inputCorreo         ? inputCorreo.value.trim()           : "";
    const contrasenaActual = inputContrasenaActual ? inputContrasenaActual.value.trim() : "";
    const contrasenaNueva  = inputContrasenaNueva  ? inputContrasenaNueva.value.trim()  : "";

    if (!nuevoCorreo) { showMsg("El correo no puede estar vacío", false); return; }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(nuevoCorreo)) { showMsg("El formato del correo no es válido", false); return; }

    if (contrasenaNueva && !contrasenaActual) { showMsg("Ingrese la contraseña actual para cambiarla", false); return; }
    if (contrasenaActual && !contrasenaNueva) { showMsg("Ingrese la nueva contraseña", false); return; }
    if (contrasenaActual && usuarioActual.contrasena !== contrasenaActual) {
        showMsg("La contraseña actual es incorrecta", false); return;
    }

    // Actualizar en localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const idx      = usuarios.findIndex(u => u.documento === usuarioActual.documento);
    if (idx !== -1) {
        usuarios[idx].correo     = nuevoCorreo;
        if (contrasenaNueva) usuarios[idx].contrasena = contrasenaNueva;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        usuarioActual.correo = nuevoCorreo;
        if (contrasenaNueva) usuarioActual.contrasena = contrasenaNueva;
        localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioActual));
    }

    if (correoU) correoU.textContent = nuevoCorreo;
    showMsg("Datos actualizados correctamente", true);
    setTimeout(cancelarEdicion, 1500);
}

function showMsg(texto, ok) {
    const el = document.getElementById("mensaje");
    if (!el) return;
    el.style.color   = ok ? "#28a745" : "#e71d73";
    el.textContent   = texto;
    setTimeout(() => el.textContent = "", 2500);
}
