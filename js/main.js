// Solicitud al jugador que coloque su nombre
let nombreJugador = prompt("Buenas jugador 🙋‍♀️, ¿Cómo te llamas?");

// Solicitud al jugador que coloque su apellido 
let apellido = prompt("¿Y tu apellido? 🤔");

// Verificar si alguno de los campos está vacío y solicitar el nombre nuevamente si es necesario
if (nombreJugador === "" || apellido === "") {
    nombreJugador = prompt("Seguro tenés un nombrecito, decímelo 🤪");
}

// Consola logueado
console.log("El nombre del jugador es: " + nombreJugador + " " + apellido);

// Saludo e invitación a jugar
alert("Hola, " + nombreJugador + " " + apellido + " Yo soy Belén, ¿jugamos? 😁");

// Número aleatorio inventado por la compu
function creaNumeroComputadora() {
    let numeros = "";
    while (numeros.length < 4) {
        let numeroIndividual = Math.floor(Math.random() * 10);
        if (!numeros.includes(numeroIndividual.toString())) {
            numeros += numeroIndividual.toString();
        }
    }
    return numeros;
}

// Contador de correctos y correctos pero no en su posición
function DevolucionCorrectos(numJugador, numCompu) {
    let correctosEnPosicion = 0;
    let correctosNoPosicion = 0;

    for (let i = 0; i < 4; i++) {
        if (numJugador[i] === numCompu[i]) {
            correctosEnPosicion++;
        } else if (numCompu.includes(numJugador[i])) {
            correctosNoPosicion++;
        }
    }

    return { correctosEnPosicion, correctosNoPosicion };
}

let numCompu = creaNumeroComputadora();

function iniciar() {
    let numJugador = document.getElementById("apuesta").value;
    let devolucion = document.getElementById("resultado");

    if (numJugador.length !== 4 || new Set(numJugador).size !== 4 || isNaN(numJugador)) {
        devolucion.innerText = "Peroooo..., te dije que un número de 4 dígitos sin repetirse.";
        return;
    }

    let resultado = DevolucionCorrectos(numJugador, numCompu);

    // Devolución al jugador
    devolucion.innerText = `Tenés ${resultado.correctosEnPosicion} correctos y en su lugar y tenés ${resultado.correctosNoPosicion} números correctos pero mal ubicados`;

    if (resultado.correctosEnPosicion === 4) {
        reiniciar();
    }
}

function reiniciar() {
    let teGustoPrompt;
    do {
        teGustoPrompt = prompt("  ¡APA! Le ganaste a la compu, estás muy inteligente hoy 🤪🤪🤪 ¿Te gustó el juego? si o no? 🤪").toLowerCase();
        if (teGustoPrompt === "si") {
            alert("¡IUJUUUUUU! ¿Jugamos de nuevo?");
            numCompu = creaNumeroComputadora();
            break;
        } else if (teGustoPrompt === "no") {
            let noGusto = prompt("¿Estás seguro? 🤨").toLowerCase();
            if (noGusto === "si") {
                continue;
            }
        }
    } while (teGustoPrompt !== "si");
    iniciar();
}

