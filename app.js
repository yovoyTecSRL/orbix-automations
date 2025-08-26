// app.js - Orbix Night Tasks
// Modo nocturno y reloj en vivo

const body = document.body;
const toggleNight = document.getElementById('toggle-night');
const clock = document.getElementById('clock');

// Estado inicial
let isNight = false;

// Toggle modo nocturno
if (toggleNight) {
  toggleNight.addEventListener('click', () => {
    isNight = !isNight;
    body.classList.toggle('night', isNight);
    toggleNight.setAttribute('aria-pressed', isNight);
    toggleNight.textContent = isNight ? 'Modo diurno' : 'Modo nocturno';
  });
}

// Reloj en vivo
function updateClock() {
  const now = new Date();
  if (clock) {
    clock.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  requestAnimationFrame(updateClock);
}
updateClock();
