// const cerrarSesion = document.getElementById("cerrarSesion");

// cerrarSesion.addEventListener("click", () => {
//     localStorage.removeItem("usuarioLogeado");
//     localStorage.removeItem("Usuarios");
//     localStorage.removeItem("Parqueadero");
//     window.location.href = "/Frontend/html/index.html";
// });

verificarRol(["Administrador"]);

document.addEventListener("DOMContentLoaded", function() {
    // Cerrar sesión directamente
    const btnCerrarSesion = document.getElementById("cerrarSesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", function(e) {
            e.preventDefault();
            cerrarSesionDirecto(); // Función del auth.js
        });
        
        btnCerrarSesion.style.cursor = "pointer";
    }
});