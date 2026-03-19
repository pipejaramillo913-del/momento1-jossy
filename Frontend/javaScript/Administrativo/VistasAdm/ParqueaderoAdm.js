// ============================================================
//  CESDE PARKING SYSTEM — ParqueaderoAdm.js  (localStorage version)
// ============================================================

verificarRol(["Administrador"]);

document.addEventListener("DOMContentLoaded", () => {
    renderEspacios();
    renderRegistros();

    const btnCerrarSesion = document.getElementById("cerrarSesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", e => { e.preventDefault(); cerrarSesionDirecto(); });
        btnCerrarSesion.style.cursor = "pointer";
    }

    // Botón registrar entrada
    const btnEntrada = document.getElementById("btn-entrada");
    if (btnEntrada) btnEntrada.addEventListener("click", registrarEntrada);

    // Botón registrar salida
    const btnSalida = document.getElementById("btn-salida");
    if (btnSalida) btnSalida.addEventListener("click", registrarSalida);
});

// ---------------------- ESPACIOS ----------------------
function renderEspacios() {
    const contenedor = document.getElementById("espacios") || document.getElementById("gridEspacios");
    if (!contenedor) return;

    const espacios = getEspacios();
    contenedor.innerHTML = "";

    espacios.forEach(e => {
        const div = document.createElement("div");
        div.className = `espacio ${e.estado === "Ocupado" ? "ocupado" : "disponible"}`;
        div.style.cssText = `
            padding: 10px; margin: 5px; border-radius: 8px; text-align: center; cursor: default;
            background: ${e.estado === "Ocupado" ? "#e71d73" : "#28a745"}; color: white; font-size: 13px;
        `;
        div.innerHTML = `<b>#${e.numero}</b><br>${e.tipo}<br>${e.estado === "Ocupado" ? e.placa : "Libre"}`;
        contenedor.appendChild(div);
    });

    // Contadores si existen en el HTML
    const totalOcupados   = espacios.filter(e => e.estado === "Ocupado").length;
    const totalDisponibles = espacios.filter(e => e.estado === "Disponible").length;

    const elOcupados    = document.getElementById("ocupados");
    const elDisponibles = document.getElementById("disponibles");
    if (elOcupados)    elOcupados.textContent    = totalOcupados;
    if (elDisponibles) elDisponibles.textContent = totalDisponibles;
}

// ---------------------- ENTRADA ----------------------
function registrarEntrada() {
    const placaInput = document.getElementById("placaEntrada");
    const tipoInput  = document.getElementById("tipoEntrada");
    const msg        = document.getElementById("msgParqueadero") || document.getElementById("mensaje");
    if (!placaInput) return;

    const placa = placaInput.value.trim().toUpperCase();
    const tipoV = tipoInput ? tipoInput.value : "Carro";

    if (!placa) { showMsg(msg, "Ingrese una placa", false); return; }

    const espacios = getEspacios();
    const registros = getRegistros();

    // Verificar que no esté ya adentro
    if (registros.some(r => r.placa === placa && !r.horaSalida)) {
        showMsg(msg, "Este vehículo ya está en el parqueadero", false);
        return;
    }

    // Buscar espacio disponible del tipo correcto
    const espacio = espacios.find(e => e.estado === "Disponible" && e.tipo === tipoV);
    if (!espacio) { showMsg(msg, `No hay espacios disponibles para ${tipoV}`, false); return; }

    // Ocupar espacio
    espacio.estado = "Ocupado";
    espacio.placa  = placa;
    saveEspacios(espacios);

    // Crear registro
    const registro = {
        id:           Date.now(),
        placa:        placa,
        tipo:         tipoV,
        espacioNum:   espacio.numero,
        horaEntrada:  new Date().toISOString(),
        horaSalida:   null,
        valorPagado:  null
    };
    registros.push(registro);
    saveRegistros(registros);

    placaInput.value = "";
    showMsg(msg, `Entrada registrada — Espacio #${espacio.numero}`, true);
    renderEspacios();
    renderRegistros();
}

// ---------------------- SALIDA ----------------------
function registrarSalida() {
    const placaInput = document.getElementById("placaSalida");
    const msg        = document.getElementById("msgParqueadero") || document.getElementById("mensaje");
    if (!placaInput) return;

    const placa = placaInput.value.trim().toUpperCase();
    if (!placa) { showMsg(msg, "Ingrese una placa", false); return; }

    const espacios  = getEspacios();
    const registros = getRegistros();

    const idx = registros.findIndex(r => r.placa === placa && !r.horaSalida);
    if (idx === -1) { showMsg(msg, "No se encontró ingreso activo con esa placa", false); return; }

    const reg        = registros[idx];
    reg.horaSalida   = new Date().toISOString();

    // Calcular tarifa
    const minutos    = Math.ceil((new Date(reg.horaSalida) - new Date(reg.horaEntrada)) / 60000);
    const tarifa     = reg.tipo === "Carro" ? 100 : 50;
    reg.valorPagado  = Math.max(minutos * tarifa, tarifa); // mínimo 1 minuto

    saveRegistros(registros);

    // Liberar espacio
    const espacio = espacios.find(e => e.numero === reg.espacioNum);
    if (espacio) { espacio.estado = "Disponible"; espacio.placa = null; }
    saveEspacios(espacios);

    placaInput.value = "";
    showMsg(msg, `Salida registrada — ${minutos} min — $${reg.valorPagado.toLocaleString()}`, true);
    renderEspacios();
    renderRegistros();
}

// ---------------------- HISTORIAL ----------------------
function renderRegistros() {
    const tbody = document.getElementById("tbodyRegistros");
    if (!tbody) return;

    const registros = getRegistros().slice().reverse(); // más recientes primero
    tbody.innerHTML = "";

    registros.forEach(r => {
        const entrada  = new Date(r.horaEntrada).toLocaleString("es-CO");
        const salida   = r.horaSalida ? new Date(r.horaSalida).toLocaleString("es-CO") : "—";
        const minutos  = r.horaSalida
            ? Math.ceil((new Date(r.horaSalida) - new Date(r.horaEntrada)) / 60000)
            : "—";
        const valor    = r.valorPagado != null ? `$${r.valorPagado.toLocaleString()}` : "—";

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${r.placa}</td>
            <td>${r.tipo}</td>
            <td>#${r.espacioNum}</td>
            <td>${entrada}</td>
            <td>${salida}</td>
            <td>${minutos}</td>
            <td>${valor}</td>
        `;
        tbody.appendChild(fila);
    });
}

// ---------------------- UTILIDADES ----------------------
function getEspacios()      { return JSON.parse(localStorage.getItem("espacios"))  || []; }
function saveEspacios(arr)  { localStorage.setItem("espacios",  JSON.stringify(arr)); }
function getRegistros()     { return JSON.parse(localStorage.getItem("registros")) || []; }
function saveRegistros(arr) { localStorage.setItem("registros", JSON.stringify(arr)); }

function showMsg(el, texto, ok) {
    if (!el) return;
    el.innerHTML = `<span style="color:${ok ? '#28a745' : '#e71d73'};">${texto}</span>`;
    setTimeout(() => el.innerHTML = "", 3000);
}
