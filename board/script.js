let currentPlayer = 0;
let currentPlayersPositions = [0, 0, 0, 0];

document.getElementById("roll-dice").addEventListener("click", () => {
  const result = Math.floor(Math.random() * 6) + 1;
  document.getElementById(
    "dice-result"
  ).textContent = `Résultat du dé: ${result}`;
  let dice = document.getElementById("dice");
  let diceFaces = dice.getElementsByClassName(`face`);
  let diceDrawnedFace = dice.getElementsByClassName(`face-${result}`)[0];

  console.log(diceFaces);
  for (let diceFace of diceFaces) {
    diceFace.style.display = "none";
  }

  diceDrawnedFace.style.display = "flex";

  movePlayer(currentPlayer, result);
  updatePlayerPosition(currentPlayer);
  // Met à jour le joueur actuel pour le prochain tour
  currentPlayer = (currentPlayer + 1) % 4;
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

function updatePlayerPosition(playerId) {
  // Récupère l'élément span du joueur
  const playerSpan = document.getElementById(`player-${playerId}`);

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
  window.open("../", "_blank");
});
