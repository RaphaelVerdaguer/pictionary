let currentPlayer = 0;
let currentPlayersPositions = [0, 0, 0, 0];
let currentDiceResult = 6;
let numberOfPlayers = 0;

document.addEventListener("DOMContentLoaded", () => {
  while (numberOfPlayers <= 1 || numberOfPlayers > 4) {
    numberOfPlayers = prompt(
      "Veuillez entrer le nombre de joueurs (Min. 2 - Max. 4):",
      "2"
    );
    numberOfPlayers = parseInt(numberOfPlayers); // Convertit la chaîne de caractères en nombre

    if (
      !isNaN(numberOfPlayers) &&
      numberOfPlayers > 1 &&
      numberOfPlayers <= 4
    ) {
      console.log(`Nombre de joueurs: ${numberOfPlayers}`);
      for (let i = 0; i < numberOfPlayers; i++) {
        let player = getPlayer(i);
        player.style.display = "flex";
      }
    } else {
      alert("Veuillez entrer un nombre valide de joueurs.");
    }
  }
});

function rollDice() {
  currentDiceResult = Math.floor(Math.random() * 6) + 1;
}

function updateDiceDisplay() {
  let dice = document.getElementById("dice");
  let diceFaces = dice.getElementsByClassName(`face`);
  let diceDrawnedFace = dice.getElementsByClassName(
    `face-${currentDiceResult}`
  )[0];

  for (let diceFace of diceFaces) {
    diceFace.style.display = "none";
  }

  diceDrawnedFace.style.display = "flex";
  diceDrawnedFace.classList.add(`player-${currentPlayer}-color`);
}

function diceAction() {
  if (currentDiceResult)
    getDrawnedDiceFace().classList.remove(`player-${currentPlayer}-color`);
  rollDice();
  updateDiceDisplay();
  movePlayer(currentPlayer, currentDiceResult);
  updatePlayerPosition(currentPlayer);
}

function computeNewPosition(start, target, max = 54) {
  let pos = target;
  if (pos > max) pos = max - (pos - max); // rebond
  return pos;
}

function setPlayerPosition(playerId, target) {
  currentPlayersPositions[playerId] = computeNewPosition(
    currentPlayersPositions[playerId],
    target
  );
}

function movePlayer(playerId, steps) {
  const current = currentPlayersPositions[playerId];
  setPlayerPosition(playerId, current + steps);
}

function getPlayer(playerId) {
  return document.getElementById(`player-${playerId}`);
}

function getDrawnedDiceFace() {
  return document
    .getElementById("dice")
    .getElementsByClassName(`face-${currentDiceResult}`)[0];
}

function updatePlayerPosition(playerId) {
  // Récupère l'élément span du joueur
  const playerSpan = getPlayer(playerId);
  const playerActualSquare = playerSpan.parentElement;

  // Récupère la case cible où le joueur doit être déplacé
  const targetSquare = document.getElementById(
    `square-${currentPlayersPositions[playerId]}`
  );

  // Ajoute le span du joueur à la nouvelle case
  if (playerSpan && targetSquare) {
    const targetRect = targetSquare.getBoundingClientRect();
    const playerActualSquareRect = playerActualSquare.getBoundingClientRect();

    // Calcule la position cible relative au plateau
    const translateX = targetRect.x - playerActualSquareRect.x;
    const translateY = targetRect.y - playerActualSquareRect.y;

    // Applique la transformation
    playerSpan.style.transform = `translate(${translateX}px, ${translateY}px)`;

    playerSpan.style.display = "flex"; // Assurez-vous que le span est visible
  }
}

function selectPlayer() {
  let players = document.querySelectorAll(".player");

  players.forEach(function (player) {
    player.classList.remove("selected");
  });

  document.getElementById(`player-${currentPlayer}`).classList.add("selected");
}

function changePlayer(event) {
  if (event) {
    // Ici, 'event.target' fait référence à l'élément cliqué (le span du joueur).
    const playerId = event.target.id;
    // Utilisation d'une expression régulière pour extraire le numéro à la fin de l'ID
    const playerNumberMatch = playerId.match(/player-(\d+)/);
    const playerNumber = playerNumberMatch ? playerNumberMatch[1] : null;

    // Ou, pour incrémenter un compteur de score ou changer la position, etc.
    // Vous pouvez utiliser 'playerSpan.id' pour identifier le joueur spécifique si nécessaire.

    getDrawnedDiceFace().classList.remove(`player-${currentPlayer}-color`);
    currentPlayer = playerNumber;
    updateDiceDisplay();
    selectPlayer();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Logique pour la gestion des mouvements ou de l'état du jeu
  console.log("Le plateau de jeu Pictionary est prêt !");

  updateDiceDisplay();

  document.getElementById("dice").addEventListener("click", diceAction);
  document.getElementById("player-0").addEventListener("click", changePlayer);
  document.getElementById("player-1").addEventListener("click", changePlayer);
  document.getElementById("player-2").addEventListener("click", changePlayer);
  document.getElementById("player-3").addEventListener("click", changePlayer);

  // Ajoute des événements de clic sur les cases
  document.querySelectorAll(".game-square").forEach((square) => {
    square.addEventListener("click", function () {
      moveSelectedPlayerToSquare(this.id);
    });
  });

  document.getElementById("qr-code").addEventListener("click", function () {
    window.open("../card/", "_blank");
  });
});

function extractId(str) {
  const parts = str.split("-");
  const last = parts[parts.length - 1];
  const n = Number(last);
  return Number.isNaN(n) ? null : n;
}

function moveSelectedPlayerToSquare(squareId) {
  const selectedPlayer = document.querySelector(".player.selected");
  if (!selectedPlayer) return alert("Aucun joueur sélectionné !");

  const targetSquare = document.getElementById(squareId);
  if (!targetSquare) return console.error(`Case ${squareId} introuvable.`);

  const target = extractId(squareId);
  setPlayerPosition(currentPlayer, target);
  updatePlayerPosition(currentPlayer);
}
