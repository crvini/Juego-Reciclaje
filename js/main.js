
function iniciarJuegoUnJugador() {
    // Oculta el modal de inicio
    document.getElementById('startModal').style.display = 'none';

    let score = 0;

    function agregarPuntos() {
        score++;
        document.getElementById('score').textContent = `Puntuación: ${score}`;
        
        if (score === 23) {
            // Muestra el modal
            var modal = document.getElementById('myModal');
            modal.style.display = 'block';
    
            // Cierra el modal cuando se hace clic en la "X"
            var closeButton = document.querySelector('.close');
            closeButton.onclick = function() {
                modal.style.display = 'none';
            }
    
            // Cierra el modal si se hace clic en cualquier parte fuera del contenido del modal
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            }
        }
    }
    
    
    
    interact('.trash-item').draggable({
        onstart(event) {
            event.target.classList.add('dragging');
        },
        onmove(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        onend(event) {
            event.target.classList.remove('dragging');
        }
    });
    
    interact('.trash-bin').dropzone({
        accept: '.trash-item',
        overlap: 0.75,
    
        ondrop(event) {
            const binType = event.target.getAttribute('data-bin');
            const itemType = event.relatedTarget.getAttribute('data-type');
    
            if (binType === itemType) {
                agregarPuntos()
                event.relatedTarget.style.display = 'none';
            }
        }
    });
}

function iniciarJuegoDosJugadores() {
    // Oculta el modal de inicio
    document.getElementById('startModal').style.display = 'none';

    function reiniciarLocalStorage() {
        localStorage.removeItem('player1Score');
        localStorage.removeItem('player2Score');
    }

    // Llama a la función para reiniciar el localStorage al inicio del juego
    reiniciarLocalStorage();

    // Obtiene el puntaje de los jugadores desde el localStorage o inicia en 0 si no existe
    let player1Score = parseInt(localStorage.getItem('player1Score')) || 0;
    let player2Score = parseInt(localStorage.getItem('player2Score')) || 0;

    let currentPlayer = 1; // Comienza con el jugador 1
    let turnoValido = true;

    // Función para actualizar el puntaje y almacenarlo en el localStorage
    function actualizarPuntaje() {
        localStorage.setItem('player1Score', player1Score);
        localStorage.setItem('player2Score', player2Score);
        document.getElementById('score').textContent = `Jugador 1: ${player1Score} - Jugador 2: ${player2Score}`;
    }
    function actualizarTurno(nuewPlayer) {
        document.getElementById('playersTurn').textContent = `Turno del Jugador ${nuewPlayer}`;
    }

    // Función para restablecer el puntaje a 0 y actualizarlo en el localStorage
    function reiniciarPuntaje() {
        player1Score = 0;
        player2Score = 0;
        actualizarPuntaje();
    }

    // Función para mostrar el ganador en un modal
    function mostrarGanador(winner) {
        var modal = document.getElementById('myModal');
        document.getElementById('winner').textContent = "El ganador es:" + winner;
        modal.style.display = 'block';
    
            // Cierra el modal cuando se hace clic en la "X"
            var closeButton = document.querySelector('.close');
            closeButton.onclick = function() {
                modal.style.display = 'none';
            }
    
            // Cierra el modal si se hace clic en cualquier parte fuera del contenido del modal
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            }

        reiniciarPuntaje(); // Restablece el puntaje después de mostrar el ganador
    }

    // Función para alternar el turno entre jugadores
    function cambiarTurno() {
        currentPlayer = (currentPlayer === 1) ? 2 : 1;
        turnoValido = true;
        actualizarPuntaje();
        actualizarTurno(currentPlayer)
    }

    // Función para mostrar una alerta cuando un jugador falle
    function mostrarAlertaFallo() {
        alert(`Jugador ${currentPlayer}, no adivinaste. Turno del otro jugador.`);
        cambiarTurno();
    }

    interact('.trash-item').draggable({
        onstart(event) {
            event.target.classList.add('dragging');
        },
        onmove(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        onend(event) {
            event.target.classList.remove('dragging');
        }
    });

    interact('.trash-bin').dropzone({
        accept: '.trash-item',
        overlap: 0.75,

        ondrop(event) {
            if (!turnoValido) {
                return;
            }

            const binType = event.target.getAttribute('data-bin');
            const itemType = event.relatedTarget.getAttribute('data-type');

            if (binType === itemType) {
                if (currentPlayer === 1) {
                    player1Score++;
                } else {
                    player2Score++;
                }
                turnoValido = true;
                event.relatedTarget.style.display = 'none';

                if (player1Score + player2Score === 23) {
                    // Fin del juego, muestra el ganador en un modal
                    let winner = player1Score > player2Score ? "Jugador 1" : "Jugador 2";
                    mostrarGanador(winner);
                } else {
                    // Cambia el turno al otro jugador
                    cambiarTurno();
                }
            } else {
                // Muestra una alerta y cambia de turno si el elemento se coloca en el lugar incorrecto
                mostrarAlertaFallo();
            }
        }
    });
}




