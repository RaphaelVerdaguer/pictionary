// Créer une nouvelle requête XMLHttpRequest
const xhr = new XMLHttpRequest();

var categories;

// Spécifier le type de requête et l'URL du fichier JSON
xhr.open("GET", "./categories.json", true);

// Définir le type de réponse attendue
xhr.responseType = "json";

// Gérer l'événement de chargement de la réponse
xhr.onload = function () {
  if (xhr.status === 200) {
    // Les données JSON sont accessibles via xhr.response
    categories = xhr.response;
    // Utilisez les données JSON ici
    console.log(categories);
    drawCard();
  } else {
    console.error("Erreur lors du chargement du fichier JSON");
  }
};

// Gérer les erreurs réseau
xhr.onerror = function() {
  console.error('Erreur réseau lors du chargement du fichier JSON');
};

// Envoyer la requête
xhr.send();

const categoriesTitle = {
  yellow: "personne, lieu ou animal",
  blue: "objet",
  orange: "action",
  green: "mot difficile",
  red: "défi",
};

function displayCard(card) {
  for (const [color, value] of Object.entries(card)) {
    const categoryContentElement = document
      .getElementsByClassName(color)[0]
      .getElementsByClassName("category-content")[0];
    categoryContentElement.textContent =
      value.charAt(0).toUpperCase() + value.slice(1);
  }
}

function flipCard() {
  var cardo = document.querySelector('.flip-card-inner');
  cardo.classList.toggle('is-flipped');
}

function seeCard() {
  unBlurCategoriesValue();
  setTimeout(blurCategoriesValue, 2000);
}

const drawButton = document.querySelector(".drawButton");
const seeButton = document.querySelector(".seeButton");
let timer;

function drawCard() {
  drawButton.disabled = true; // Désactive le bouton
  startTimer(60); // Commence le timer avec une durée de 60 secondes

  const card = {};

  for (const [color, category] of Object.entries(categories)) {
    const randomIndex = Math.floor(Math.random() * category.length);
    card[color] = category[randomIndex];
  }

  displayCard(card);
}

function startTimer(duration) {
  let timerValue = duration;
  drawButton.textContent = timerValue + " s"; // Affiche le temps restant dans le bouton

  timer = setInterval(function () {
    timerValue--;
    drawButton.textContent = timerValue + " s"; // Met à jour le temps restant dans le bouton

    if (duration - timerValue == 2) {
      flipCard();
    }
    if (timerValue <= 0) {
      clearInterval(timer);
      drawButton.disabled = false; // Réactive le bouton
      drawButton.textContent = "Tirer une carte"; // Affiche le texte initial dans le bouton
      flipCard();
    }
  }, 1000);
}

drawButton.addEventListener("click", drawCard);
seeButton.addEventListener("click", seeCard);

document.addEventListener('DOMContentLoaded', function() {
  var card = document.querySelector('.flip-card-inner');
  card.addEventListener('click', function() {
    flipCard();
  });
});