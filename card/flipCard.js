// Préparer les éléments DOM
const card = document.querySelector(".flip-card-inner");
// Basculer l'état "flippé" de la carte
function flipCard() {
    card.classList.toggle("is-flipped");
  }

card.addEventListener("click", flipCard);