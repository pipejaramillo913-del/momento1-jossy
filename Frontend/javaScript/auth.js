// ============================================================
//  CESDE PARKING SYSTEM — auth.js  (localStorage version)
// ============================================================

function verificarAutenticacion() {
    const usuarioLogeado = localStorage.getItem("usuarioLogeado");
    if (!usuarioLogeado) {
        alert("Debe iniciar sesión para acceder a esta página");
        window.location.href = "/Frontend/html/login.html";
        return null;
    }
    try {
        return JSON.parse(usuarioLogeado);
    } catch {
        localStorage.removeItem("usuarioLogeado");
        window.location.href = "/Frontend/html/login.html";
        return null;
    }
}

function verificarRol(rolesPermitidos) {
    const usuario = verificarAutenticacion();
    if (!usuario) return false;

    if (!rolesPermitidos.includes(usuario.rol)) {
        alert("No tiene permisos para acceder a esta página");
        if (usuario.rol === "Administrador") {
            window.location.href = "/Frontend/html/Administrativo/administrativo.html";
        } else {
            window.location.href = "/Frontend/html/Usuarios/panel_usuario.html";
        }
        return false;
    }
    return true;
}

function obtenerUsuarioActual() {
    const raw = localStorage.getItem("usuarioLogeado");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}

function cerrarSesion() {
    if (confirm("¿Está seguro que desea cerrar sesión?")) {
        localStorage.removeItem("usuarioLogeado");
        window.location.href = "/Frontend/html/login.html";
    }
}

function cerrarSesionDirecto() {
    localStorage.removeItem("usuarioLogeado");
    window.location.href = "/Frontend/html/login.html";
}

function prevenirRetroceso() {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
    };
}

document.addEventListener("DOMContentLoaded", function () {
    const usuario = verificarAutenticacion();
    if (usuario) {
        const el = document.getElementById("nombreUsuario");
        if (el) el.textContent = usuario.nombre;
        prevenirRetroceso();
    }
});
