//Solicitud al jugador que coloque su nombre
let nombreJugador = prompt ("Buenas jugador 🙋‍♀️, ¿Cómo te llamas?") 

if(nombreJugador === "" || apellido === "" ) {
   let nombre2 = prompt ("Seguro tenes un nombrecito, decimelo 🤪")
}

//Solicitud al jugador que coloque su apellido 
let apellido = prompt ("Y tu apellido? 🤔")

//Consologueado
console.log("El nombre del jugador es : " + nombreJugador || nombre2 + " "+ apellido);

//Saludo e invitacion a jugar
alert("Hola, " + nombreJugador + " " + apellido +  " Yo soy Belén, jugamos? 😁")

// Numero Aleatorio inventado por la compu
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

// Contador de Correctos e Correctos pero no en su posicion
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
    let numJugador = document.getElementById("Apuesta").value;
    let devolucion = document.getElementById("resultado");

    if (numJugador.length !== 4 || new Set(numJugador).size !== 4 || isNaN(numJugador)) {
        devolucion.innerText = "Peroooo..., te dije que un número de 4 dígitos sin repetirse.";
        return;
    }

    let resultado = verificarAdivinanza(numJugador, numCompu);

    // Devolucion al jugador
    devolucion.innerText = `Tenes ${resultado.correctosEnPosicion} correctos y en su lugar y tenes ${resultado.correctosNoPosicion} numeros correctos pero mal ubicados`;

    if (resultado.correctosEnPosicion === 4) {
        devolucion.innerText += `¡APA! Le ganaste a la compu, estas muy inteligente hoy 🤪🤪🤪`;
    }
    
}
