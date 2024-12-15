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

function movePlayer(playerId, steps) {
  let currentPlayerPosition = currentPlayersPositions[playerId];
  const newPosition = currentPlayerPosition + steps;

  currentPlayerPosition = newPosition;
  // Gestion du dépassement pour un plateau de 55 cases
  if (currentPlayerPosition > 54)
    currentPlayerPosition = 54 - (currentPlayerPosition - 54);

  currentPlayersPositions[playerId] = currentPlayerPosition;
  console.log(currentPlayersPositions);
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

  // Récupère la case cible où le joueur doit être déplacé
  const targetSquare = document.getElementById(
    `square-${currentPlayersPositions[playerId]}`
  );

  // Ajoute le span du joueur à la nouvelle case
  if (playerSpan && targetSquare) {
    targetSquare.appendChild(playerSpan);
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

function moveSelectedPlayerToSquare(squareId) {
  const selectedPlayer = document.querySelector(".player.selected");
  if (!selectedPlayer) {
    alert("Aucun joueur sélectionné !");
    return;
  }

  const targetSquare = document.getElementById(squareId);
  if (!targetSquare) {
    console.error(`La case ${squareId} n'existe pas.`);
    return;
  }

  targetSquare.appendChild(selectedPlayer);

  const playerId = parseInt(selectedPlayer.id.split("-")[1]);
  const squareIndex = parseInt(squareId.split("-")[1]);
  currentPlayersPositions[playerId] = squareIndex;

  console.log(`Joueur ${playerId} déplacé dans la case ${squareIndex}`);
}
