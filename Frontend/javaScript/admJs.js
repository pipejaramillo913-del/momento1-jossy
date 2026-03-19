let TipoDeVehiculo = document.querySelector("#tipo");
let Tiempo = document.querySelector("#minutos");
let salida = document.querySelector("#resultado");

TipoDeVehiculo.addEventListener("change", actualizarTarifa);
Tiempo.addEventListener("keyup", actualizarTarifa);

function actualizarTarifa() {
    let tarifaPorMinuto;

    if (TipoDeVehiculo.value === "carro") {
        tarifaPorMinuto = 100;
    } else {
        tarifaPorMinuto = 50;
    }

    let minutosIngresados = Tiempo.value;
    if (minutosIngresados === "") {
        minutosIngresados = 0;
    }

    let costo = minutosIngresados * tarifaPorMinuto;

    salida.innerText = "$" + costo;
}