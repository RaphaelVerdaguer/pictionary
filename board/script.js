import {
  BOARD_MAX_INDEX,
  BOARD_CATEGORIES,
  createGameState,
  getBoardSquares,
  movePlayerBySteps,
  movePlayerToPosition,
  rollDice,
  selectPlayer,
  setPlayerCount,
} from "../common/domain/board.js";

let state = createGameState(2);

const board = document.getElementById("game-board");
const dice = document.getElementById("dice");
const startButton = document.getElementById("start-game");
const nextPlayerButton = document.getElementById("next-player");
const playerButtons = Array.from(document.querySelectorAll(".player"));
const activePlayerStatus = document.getElementById("active-player-status");
const diceStatus = document.getElementById("dice-status");
const positionStatus = document.getElementById("position-status");
const actionStatus = document.getElementById("action-status");

function init() {
  renderBoardSquares();
  bindEvents();
  render();
}

function bindEvents() {
  startButton.addEventListener("click", startGame);
  nextPlayerButton.addEventListener("click", selectNextPlayer);
  dice.addEventListener("click", handleDiceRoll);

  playerButtons.forEach((playerButton, playerId) => {
    playerButton.addEventListener("click", () => {
      state = selectPlayer(state, playerId);
      render();
    });
  });
}

function renderBoardSquares() {
  const fragment = document.createDocumentFragment();

  getBoardSquares().forEach((square) => {
    const button = document.createElement("button");
    button.type = "button";
    button.id = `square-${square.index}`;
    button.className = `game-square ${square.category}`;
    button.dataset.squareIndex = String(square.index);
    button.style.gridColumn = String(square.column);
    button.style.gridRow = String(square.row);
    button.setAttribute(
      "aria-label",
      `Case ${square.index}, ${BOARD_CATEGORIES[square.category].label}`
    );
    button.textContent = square.label;

    if (square.index === 0 || square.index === BOARD_MAX_INDEX) {
      const marker = document.createElement("span");
      marker.className = "topComment";
      marker.textContent = square.index === 0 ? "Depart" : "Arrivee";
      button.append(marker);
    }

    button.addEventListener("click", () => {
      state = movePlayerToPosition(state, state.currentPlayer, square.index);
      actionStatus.textContent = `Joueur ${state.currentPlayer + 1} deplace sur la case ${square.index}.`;
      render();
    });

    fragment.append(button);
  });

  board.append(fragment);
}

function startGame() {
  const selectedCount = Number(
    document.querySelector('input[name="player-count"]:checked').value
  );

  state = setPlayerCount(state, selectedCount);
  actionStatus.textContent = `Partie demarree avec ${selectedCount} joueurs.`;
  render();
}

function handleDiceRoll() {
  if (!state.hasStarted) {
    startGame();
  }

  const result = rollDice();
  state = {
    ...movePlayerBySteps(state, state.currentPlayer, result),
    currentDiceResult: result,
  };

  actionStatus.textContent = `Joueur ${state.currentPlayer + 1} avance de ${result} case${result > 1 ? "s" : ""}.`;
  render();
}

function selectNextPlayer() {
  if (!state.hasStarted) {
    startGame();
    return;
  }

  const nextPlayer = (state.currentPlayer + 1) % state.playerCount;
  state = selectPlayer(state, nextPlayer);
  actionStatus.textContent = `Joueur ${nextPlayer + 1} tire sur son telephone.`;
  render();
}

function render() {
  renderPlayers();
  renderDice();
  renderStatus();
}

function renderPlayers() {
  playerButtons.forEach((playerButton, playerId) => {
    const isVisible = playerId < state.playerCount;
    playerButton.hidden = !isVisible;
    playerButton.classList.toggle("selected", playerId === state.currentPlayer);
    playerButton.setAttribute(
      "aria-pressed",
      String(playerId === state.currentPlayer)
    );

    if (isVisible) {
      movePlayerElement(playerButton, state.positions[playerId]);
    }
  });
}

function movePlayerElement(playerButton, position) {
  const targetSquare = document.getElementById(`square-${position}`);
  const startSquare = document.getElementById("player-start-position");

  if (!targetSquare || !startSquare) return;

  const targetRect = targetSquare.getBoundingClientRect();
  const startRect = startSquare.getBoundingClientRect();
  const translateX = targetRect.x - startRect.x;
  const translateY = targetRect.y - startRect.y;

  playerButton.style.transform = `translate(${translateX}px, ${translateY}px)`;
}

function renderDice() {
  const faces = dice.querySelectorAll(".face");
  const selectedFace = dice.querySelector(`.face-${state.currentDiceResult}`);

  faces.forEach((face) => {
    face.classList.remove(
      "player-0-color",
      "player-1-color",
      "player-2-color",
      "player-3-color"
    );
    face.hidden = true;
  });

  if (selectedFace) {
    selectedFace.hidden = false;
    selectedFace.classList.add(`player-${state.currentPlayer}-color`);
  }
}

function renderStatus() {
  activePlayerStatus.textContent = `Joueur ${state.currentPlayer + 1}`;
  diceStatus.textContent = String(state.currentDiceResult);
  positionStatus.textContent = `${state.positions[state.currentPlayer]} / ${BOARD_MAX_INDEX}`;
  nextPlayerButton.disabled = !state.hasStarted;
}

document.addEventListener("DOMContentLoaded", init);
