import {
  capitalizeFirstLetter,
  createCardRoundState,
  drawCard,
  hideCard,
  revealCard,
  startCardRound,
  tickCardRound,
} from "../common/domain/cards.js";
import { getBoardSquares } from "../common/domain/board.js";
import { loadCategories } from "../common/infrastructure/categoriesRepository.js";
import { createAudio, stopAudio } from "../common/infrastructure/audio.js";

const TIMER_DURATION = 60;
const BEEP_FILE = "./beep-21.mp3";

let categories = null;
let timerId = null;
let beepSound = null;
let roundState = createCardRoundState(TIMER_DURATION);

const card = document.getElementById("card");
const cardControl = document.getElementById("card-control");
const timerValue = document.getElementById("timer-value");
const statusMessage = document.getElementById("card-status");
const miniBoard = document.getElementById("game-board-mini");

async function init() {
  renderMiniBoard();
  bindEvents();
  beepSound = createAudio(BEEP_FILE);

  try {
    categories = await loadCategories("./categories.json");
    statusMessage.textContent = "Carte prete.";
    cardControl.setAttribute("aria-disabled", "false");
  } catch (error) {
    statusMessage.textContent = error.message;
    cardControl.setAttribute("aria-disabled", "true");
  }
}

function bindEvents() {
  cardControl.addEventListener("pointerdown", handlePressStart);
  cardControl.addEventListener("pointerup", handlePressEnd);
  cardControl.addEventListener("pointercancel", handlePressEnd);
  cardControl.addEventListener("pointerleave", handlePressEnd);
  cardControl.addEventListener("keydown", handleKeyDown);
  cardControl.addEventListener("keyup", handleKeyUp);
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

function handlePressStart(event) {
  if (!categories) return;

  event.preventDefault();
  if (cardControl.setPointerCapture) {
    cardControl.setPointerCapture(event.pointerId);
  }

  if (!roundState.isRunning) {
    startNewRound();
    return;
  }

  roundState = revealCard(roundState);
  renderCardState();
}

function handlePressEnd(event) {
  if (!roundState.currentCard) return;

  event.preventDefault();
  if (
    cardControl.releasePointerCapture &&
    cardControl.hasPointerCapture?.(event.pointerId)
  ) {
    cardControl.releasePointerCapture(event.pointerId);
  }
  hideCurrentCard();
}

function handleKeyDown(event) {
  if (event.key !== " " && event.key !== "Enter") return;
  if (event.repeat) return;
  if (!categories) return;

  event.preventDefault();

  if (!roundState.isRunning) {
    startNewRound();
    return;
  }

  roundState = revealCard(roundState);
  renderCardState();
}

function handleKeyUp(event) {
  if (event.key !== " " && event.key !== "Enter") return;

  event.preventDefault();
  hideCurrentCard();
}

function startNewRound() {
  if (!categories) return;

  clearRunningTimers();
  roundState = startCardRound(
    roundState,
    drawCard(categories),
    TIMER_DURATION
  );
  updateCardDisplay(roundState.currentCard);
  startTimer(TIMER_DURATION);
  statusMessage.textContent = "Manche en cours.";
  renderCardState();
}

function hideCurrentCard() {
  roundState = hideCard(roundState);
  renderCardState();
}

function updateCardDisplay(cardData) {
  for (const [color, value] of Object.entries(cardData)) {
    const contentElement = document.querySelector(`[data-category="${color}"]`);
    contentElement.textContent = capitalizeFirstLetter(value);
  }
}

function startTimer(duration) {
  roundState = { ...roundState, timeRemaining: duration };
  renderTimer();

  timerId = setInterval(() => {
    roundState = tickCardRound(roundState);
    renderTimer();

    if (roundState.timeRemaining <= 10 && roundState.timeRemaining > 0) {
      playBeep();
    }

    if (roundState.timeRemaining <= 0) {
      finishTimer();
    }
  }, 1000);
}

function renderTimer() {
  timerValue.textContent = `${roundState.timeRemaining} s`;
  timerValue.classList.toggle("timer-danger", roundState.timeRemaining <= 10);
}

function renderCardState() {
  card.classList.toggle("is-flipped", !roundState.isRevealed);
  cardControl.setAttribute("aria-pressed", String(roundState.isRevealed));
}

function finishTimer() {
  clearRunningTimers();
  roundState = { ...roundState, isRunning: false };
  statusMessage.textContent = "Temps ecoule. Nouvelle carte prete.";
  timerValue.classList.remove("timer-danger");
  renderCardState();
}

function clearRunningTimers() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function playBeep() {
  stopAudio(beepSound);
  beepSound.play().catch(() => {
    statusMessage.textContent = "Le son est bloque par le navigateur.";
  });
}

document.addEventListener("DOMContentLoaded", init);
