// ============================================================
//  CESDE PARKING SYSTEM — UsuariosAdm.js  (localStorage version)
// ============================================================

verificarRol(["Administrador"]);

const Crear         = document.getElementById("btn-crearUsuario");
const mensaje       = document.getElementById("mensaje");
const cedula        = document.getElementById("cedula");
const nombre        = document.getElementById("nombre");
const correo        = document.getElementById("correo");
const contrasena    = document.getElementById("contrasena");
const rol           = document.getElementById("rol");
const estado        = document.getElementById("estado");
const tbodyUsuarios = document.getElementById("tbodyUsuarios");

document.addEventListener("DOMContentLoaded", () => {
    mostrarTablaUsuarios();

    const btnCerrarSesion = document.getElementById("cerrarSesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", e => { e.preventDefault(); cerrarSesionDirecto(); });
        btnCerrarSesion.style.cursor = "pointer";
    }
});

Crear.addEventListener("click", crearNuevoUsuario);

// ---------------------- CREAR ----------------------
function crearNuevoUsuario() {
    if (!cedula.value || !nombre.value || !correo.value || !contrasena.value || !rol.value) {
        showMsg("Todos los campos son obligatorios", false);
        return;
    }

    const usuarios = getUsuarios();

    if (usuarios.some(u => u.documento === cedula.value.trim())) {
        showMsg("Ya existe un usuario con esta cédula", false);
        return;
    }
    if (usuarios.some(u => u.correo === correo.value.trim())) {
        showMsg("Ya existe un usuario con este correo", false);
        return;
    }

    usuarios.push({
        documento: cedula.value.trim(),
        nombre:    nombre.value.trim(),
        correo:    correo.value.trim(),
        contrasena: contrasena.value.trim(),
        rol:       rol.value.trim(),
        estado:    "Activo"
    });

    saveUsuarios(usuarios);
    showMsg("Usuario creado exitosamente", true);
    limpiarFormulario();
    mostrarTablaUsuarios();
}

// ---------------------- LISTAR ----------------------
function mostrarTablaUsuarios() {
    const usuarios = getUsuarios();
    tbodyUsuarios.innerHTML = "";

    usuarios.forEach(u => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${u.documento}</td>
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td>${u.rol}</td>
            <td>${u.estado}</td>
            <td>
                <i class="bi bi-arrow-repeat icon" style="cursor:pointer;" onclick="editarUsuario('${u.documento}')"></i>
                <i class="bi bi-trash icon" style="cursor:pointer;" onclick="eliminarUsuario('${u.documento}')"></i>
            </td>
        `;
        tbodyUsuarios.appendChild(fila);
    });
}

// ---------------------- ELIMINAR ----------------------
function eliminarUsuario(doc) {
    mensaje.innerHTML = `
        <span>¿Eliminar usuario <b>${doc}</b>?</span>
        <button id="btnSi" class="btn-crearUsuario">Sí</button>
        <button id="btnNo" class="btn-crearUsuario">No</button>
    `;

    document.getElementById("btnSi").addEventListener("click", () => {
        const nuevos = getUsuarios().filter(u => u.documento !== doc);
        saveUsuarios(nuevos);
        mostrarTablaUsuarios();
        showMsg("Usuario eliminado exitosamente", true);
    });

    document.getElementById("btnNo").addEventListener("click", () => {
        showMsg("Eliminación cancelada", false);
    });
}

// ---------------------- EDITAR ----------------------
function editarUsuario(doc) {
    const usuarios = getUsuarios();
    const index    = usuarios.findIndex(u => u.documento === doc);
    if (index === -1) return;

    const u = usuarios[index];

    cedula.value    = u.documento;
    nombre.value    = u.nombre;
    correo.value    = u.correo;
    if (contrasena) contrasena.style.display = "none";
    if (estado)     { estado.style.display = "block"; estado.value = u.estado; }
    rol.value       = u.rol;

    Crear.textContent = "Actualizar";
    Crear.removeEventListener("click", crearNuevoUsuario);

    function guardarCambios() {
        usuarios[index].nombre  = nombre.value.trim();
        usuarios[index].correo  = correo.value.trim();
        usuarios[index].estado  = estado ? estado.value.trim() : u.estado;
        usuarios[index].rol     = rol.value.trim();

        if (contrasena) contrasena.style.display = "block";
        if (estado)     estado.style.display     = "none";

        saveUsuarios(usuarios);
        mostrarTablaUsuarios();
        limpiarFormulario();

        Crear.textContent = "Crear";
        Crear.removeEventListener("click", guardarCambios);
        Crear.addEventListener("click", crearNuevoUsuario);

        showMsg("Usuario actualizado exitosamente", true);
    }

    Crear.addEventListener("click", guardarCambios);
}

// ---------------------- UTILIDADES ----------------------
function getUsuarios()          { return JSON.parse(localStorage.getItem("usuarios")) || []; }
function saveUsuarios(arr)      { localStorage.setItem("usuarios", JSON.stringify(arr)); }

function limpiarFormulario() {
    cedula.value    = "";
    nombre.value    = "";
    correo.value    = "";
    if (contrasena) contrasena.value = "";
    rol.value       = "";
    if (estado)     estado.value = "";
}

function showMsg(texto, ok) {
    mensaje.innerHTML = `<span style="color:${ok ? '#28a745' : '#e71d73'};">${texto}</span>`;
    setTimeout(() => mensaje.innerHTML = "", 2500);
}
