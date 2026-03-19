// ============================================================
//  CESDE PARKING SYSTEM — login.js  (localStorage version)
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // --- Datos iniciales si no existen ---
    if (!localStorage.getItem("usuarios")) {
        const usuariosDefault = [
            {
                documento: "1001",
                nombre: "Admin CESDE",
                correo: "admin@cesde.com",
                contrasena: "1234",
                rol: "Administrador",
                estado: "Activo"
            },
            {
                documento: "1002",
                nombre: "Estudiante Demo",
                correo: "estudiante@cesde.com",
                contrasena: "1234",
                rol: "Estudiante",
                estado: "Activo"
            }
        ];
        localStorage.setItem("usuarios", JSON.stringify(usuariosDefault));
    }

    if (!localStorage.getItem("vehiculos")) {
        localStorage.setItem("vehiculos", JSON.stringify([]));
    }

    if (!localStorage.getItem("espacios")) {
        const espacios = [];
        for (let i = 1; i <= 10; i++) {
            espacios.push({ numero: i, tipo: "Carro", estado: "Disponible", placa: null });
        }
        for (let i = 11; i <= 20; i++) {
            espacios.push({ numero: i, tipo: "Moto", estado: "Disponible", placa: null });
        }
        localStorage.setItem("espacios", JSON.stringify(espacios));
    }

    if (!localStorage.getItem("registros")) {
        localStorage.setItem("registros", JSON.stringify([]));
    }

    // --- Login ---
    const form = document.getElementById("inputs");
    const mensaje = document.getElementById("mensaje");
    const shadowLogin = document.getElementById("login");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        localStorage.removeItem("usuarioLogeado");

        const email    = document.getElementById("email").value.trim();
        const password = document.getElementById("contrasena").value.trim();

        if (!email || !password) {
            mostrarError("Por favor complete todos los campos");
            return;
        }

        const usuarios   = JSON.parse(localStorage.getItem("usuarios")) || [];
        const encontrado = usuarios.find(u => u.correo === email && u.contrasena === password);

        if (encontrado) {
            mensaje.textContent    = `¡Bienvenido ${encontrado.nombre}!`;
            mensaje.style.color    = "green";
            shadowLogin.style.boxShadow = "0px 0px 500px green";

            localStorage.setItem("usuarioLogeado", JSON.stringify(encontrado));

            setTimeout(() => {
                if (encontrado.rol === "Administrador") {
                    window.location.href = "/Frontend/html/Administrativo/administrativo.html";
                } else {
                    window.location.href = "/Frontend/html/Usuarios/panel_usuario.html";
                }
            }, 800);

        } else {
            mostrarError("Correo o contraseña incorrecta");
        }
    });

    function mostrarError(texto) {
        mensaje.textContent         = texto;
        mensaje.style.color         = "var(--rosado)";
        shadowLogin.style.boxShadow = "0px 0px 500px var(--rosado)";
        setTimeout(() => {
            mensaje.textContent         = "Ingresa tus datos";
            mensaje.style.color         = "";
            shadowLogin.style.boxShadow = "";
        }, 2000);
    }
});
