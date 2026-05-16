import { drawCard, capitalizeFirstLetter } from "../common/domain/cards.js";
import { getBoardSquares } from "../common/domain/board.js";
import { loadCategories } from "../common/infrastructure/categoriesRepository.js";
import { createAudio, stopAudio } from "../common/infrastructure/audio.js";

const TIMER_DURATION = 60;
const SHOW_CARD_DELAY = 5;
const BEEP_FILE = "./beep-21.mp3";

let categories = null;
let timerId = null;
let revealTimeoutId = null;
let timeRemaining = TIMER_DURATION;
let beepSound = null;

const card = document.getElementById("card");
const drawButton = document.getElementById("draw-card");
const timerValue = document.getElementById("timer-value");
const statusMessage = document.getElementById("card-status");
const miniBoard = document.getElementById("game-board-mini");

async function init() {
  renderMiniBoard();
  bindEvents();
  beepSound = createAudio(BEEP_FILE);

  try {
    categories = await loadCategories("./categories.json");
    statusMessage.textContent = "Cartes pretes.";
    drawButton.disabled = false;
  } catch (error) {
    statusMessage.textContent = error.message;
    drawButton.disabled = true;
  }
}

function bindEvents() {
  card.addEventListener("click", toggleCard);
  drawButton.addEventListener("click", handleDrawCard);
}

function renderMiniBoard() {
  const fragment = document.createDocumentFragment();

  getBoardSquares().forEach((square) => {
    const cell = document.createElement("span");
    cell.className = `game-square-mini ${square.category}`;
    cell.style.gridColumn = String(square.column);
    cell.style.gridRow = String(square.row);
    fragment.append(cell);
  });

  miniBoard.append(fragment);
}

function handleDrawCard() {
  if (!categories) return;

  clearRunningTimers();
  updateCardDisplay(drawCard(categories));
  revealCardWithDelay();
  startTimer(TIMER_DURATION);
  statusMessage.textContent = "Manche en cours.";
  drawButton.disabled = true;
}

function updateCardDisplay(cardData) {
  for (const [color, value] of Object.entries(cardData)) {
    const contentElement = document.querySelector(`[data-category="${color}"]`);
    contentElement.textContent = capitalizeFirstLetter(value);
  }
}

function revealCardWithDelay() {
  card.classList.remove("is-flipped");
  revealTimeoutId = setTimeout(() => {
    card.classList.add("is-flipped");
  }, SHOW_CARD_DELAY * 1000);
}

function toggleCard() {
  card.classList.toggle("is-flipped");
}

function startTimer(duration) {
  timeRemaining = duration;
  renderTimer();

  timerId = setInterval(() => {
    timeRemaining -= 1;
    renderTimer();

    if (timeRemaining <= 10 && timeRemaining > 0) {
      playBeep();
    }

    if (timeRemaining <= 0) {
      finishTimer();
    }
  }, 1000);
}

function renderTimer() {
  timerValue.textContent = `${timeRemaining} s`;
  timerValue.classList.toggle("timer-danger", timeRemaining <= 10);
}

function finishTimer() {
  clearRunningTimers();
  drawButton.disabled = false;
  statusMessage.textContent = "Temps ecoule. Vous pouvez tirer une nouvelle carte.";
  timerValue.classList.remove("timer-danger");
}

function clearRunningTimers() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  if (revealTimeoutId) {
    clearTimeout(revealTimeoutId);
    revealTimeoutId = null;
  }
}

function playBeep() {
  stopAudio(beepSound);
  beepSound.play().catch(() => {
    statusMessage.textContent = "Le son est bloque par le navigateur.";
  });
}

document.addEventListener("DOMContentLoaded", init);
