
// WEB ANIMATION 
document.addEventListener('DOMContentLoaded', function() {
    if (typeof VANTA !== 'undefined') {
        VANTA.NET({
          el: "#main",
          mouseControls: true,
          touchControls: true,
          gyroControls: true,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xFF0000,
          backgroundColor: 0x131313,
          points: 9.00,
          maxDistance: 17.00
        });
    }
});

// Navigation bar logic is now handled in loadComponents.js

const eventDate = new Date("November 26, 2025 10:00:00").getTime();


function updateTimer() {
  const now = new Date().getTime();            
  const diff = eventDate - now;                 
  // If the event has already started
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Display it
  document.querySelector(".day .value").textContent = days;
  document.querySelector(".hour .value").textContent = hours;
  document.querySelector(".min .value").textContent = minutes;
  document.querySelector(".sec .value").textContent = seconds;
  }

  const timerInterval = setInterval(updateTimer, 1000);
updateTimer();