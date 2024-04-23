let currentPlayer = 0;
let currentPlayersPositions = [0, 0, 0, 0];
let currentDiceResult = 0;
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

document.getElementById("roll-dice").addEventListener("click", () => {
  if (currentDiceResult)
    getDrawnedDiceFace().classList.remove(`player-${currentPlayer}-color`);
  currentDiceResult = Math.floor(Math.random() * 6) + 1;
  getDrawnedDiceFace().classList.add(`player-${currentPlayer}-color`);
  document.getElementById(
    "dice-result"
  ).textContent = `Résultat du dé: ${currentDiceResult}`;
  let dice = document.getElementById("dice");
  let diceFaces = dice.getElementsByClassName(`face`);
  let diceDrawnedFace = dice.getElementsByClassName(
    `face-${currentDiceResult}`
  )[0];

  console.log(diceFaces);
  for (let diceFace of diceFaces) {
    diceFace.style.display = "none";
  }

  diceDrawnedFace.style.display = "flex";
  diceDrawnedFace.classList.add(`player-${currentPlayer}-color`);

  movePlayer(currentPlayer, currentDiceResult);
  updatePlayerPosition(currentPlayer);
  // Met à jour le joueur actuel pour le prochain tour
  //currentPlayer = (currentPlayer + 1) % numberOfPlayers;
});

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

document.addEventListener("DOMContentLoaded", () => {
  // Logique pour la gestion des mouvements ou de l'état du jeu
  console.log("Le plateau de jeu Pictionary est prêt !");
});

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

document.getElementById("draw-card").addEventListener("click", function () {
  window.open("../card/", "_blank");
});

document.getElementById("change-player").addEventListener("click", function () {
  getDrawnedDiceFace().classList.remove(`player-${currentPlayer}-color`);
  currentPlayer = (currentPlayer + 1) % numberOfPlayers;
  getDrawnedDiceFace().classList.add(`player-${currentPlayer}-color`);
  updatePlayerTurn();
});

function updatePlayerTurn() {
  let joueur = document.getElementById("current-player");
  joueur.textContent = `Joueur actuel: ${currentPlayer + 1}`;
}

updatePlayerTurn();
