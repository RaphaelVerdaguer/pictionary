// Ajout d'une méthode pour stopper et réinitialiser un Audio
Audio.prototype.stop = function () {
  this.pause();
  this.currentTime = 0;
};

// Variables globales
let beepSound;
let timer;
let beepInterval;
const beepFileName = "./beep-21.mp3";
const TIMER_DURATION = 60;
const SHOW_CARD_DELAY = 5;
const categoriesTitle = {
  yellow: "personne, lieu ou animal",
  blue: "objet",
  orange: "action",
  green: "mot difficile",
  red: "défi",
};
let categories;

// Préparer les éléments DOM
const card = document.querySelector(".flip-card-inner");
const drawButton = document.querySelector(".drawButton");

// Fonction principale appelée lors du chargement du document
document.addEventListener("DOMContentLoaded", function () {
  beepSound = new Audio(beepFileName); // Charger le fichier audio
  fetchCategories(); // Charger les catégories JSON
  addEventListeners(); // Ajouter les événements nécessaires
});

// Charger les catégories depuis le fichier JSON
function fetchCategories() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "./categories.json", true);
  xhr.responseType = "json";

  xhr.onload = function () {
    if (xhr.status === 200) {
      categories = xhr.response;
      console.log(categories); // Pour debug
    } else {
      console.error("Erreur lors du chargement du fichier JSON");
    }
  };

  xhr.onerror = function () {
    console.error("Erreur réseau lors du chargement du fichier JSON");
  };

  xhr.send();
}

// Ajouter les gestionnaires d'événements
function addEventListeners() {
  card.addEventListener("click", toggleCardWithDelay);
  drawButton.addEventListener("click", drawCard);
}

// Afficher une nouvelle carte
function drawCard() {
  if (!categories) {
    console.error("Les catégories ne sont pas encore chargées.");
    return;
  }
  toggleCardWithDelay();
  drawButton.disabled = true; // Désactiver le bouton
  startTimer(TIMER_DURATION); // Démarrer le minuteur
  displayRandomCard(); // Afficher une carte aléatoire
}

// Générer et afficher une carte aléatoire
function displayRandomCard() {
  const cardData = {};

  for (const [color, category] of Object.entries(categories)) {
    const randomIndex = Math.floor(Math.random() * category.length);
    cardData[color] = category[randomIndex];
  }

  updateCardDisplay(cardData);
}

// Mettre à jour l'affichage de la carte avec les données générées
function updateCardDisplay(cardData) {
  for (const [color, value] of Object.entries(cardData)) {
    const contentElement = document
      .getElementsByClassName(color)[0]
      .getElementsByClassName("category-content")[0];
    contentElement.textContent = capitalizeFirstLetter(value);
  }
}

// Basculer la carte avec un délai
function toggleCardWithDelay() {
  flipCard();
  setTimeout(flipCard, SHOW_CARD_DELAY * 1000);
}

// Basculer l'état "flippé" de la carte
function flipCard() {
  card.classList.toggle("is-flipped");
}

// Démarrer le minuteur et gérer les bips
function startTimer(duration) {
  let timeRemaining = duration;

  drawButton.textContent = `${timeRemaining} s`;

  timer = setInterval(() => {
    timeRemaining--;

    updateTimerDisplay(timeRemaining);
    handleTimerEvents(timeRemaining);

    if (timeRemaining <= 0) {
      clearInterval(timer);
      resetDrawButton();
    }
  }, 1000);
}

// Mettre à jour l'affichage du temps restant
function updateTimerDisplay(timeRemaining) {
  drawButton.textContent = `${timeRemaining} s`;

  if (timeRemaining < 10) {
    toggleButtonRedEffect();
  } else {
    drawButton.classList.remove("button-red");
  }
}

// Gérer les événements du minuteur
function handleTimerEvents(timeRemaining) {
  if (timeRemaining <= 10) {
    playBeep();
  }
}

// Jouer un son de bip
function playBeep() {
  if (beepSound) {
    beepSound.stop();
    beepSound.play().catch((error) => {
      console.error("Erreur lors de la lecture du bip :", error);
    });
  }
}

// Réinitialiser l'état du bouton de tirage
function resetDrawButton() {
  clearInterval(beepInterval); // Arrêter les bips accélérés
  drawButton.disabled = false;
  drawButton.textContent = "Tirer une carte";
  drawButton.classList.remove("button-red");
}

// Ajouter ou retirer l'effet rouge sur le bouton
function toggleButtonRedEffect() {
  drawButton.classList.toggle("button-red");
}

// Capitaliser la première lettre d'une chaîne
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
