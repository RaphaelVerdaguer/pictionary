export const BOARD_MAX_INDEX = 54;

export const BOARD_CATEGORIES = {
  yellow: { label: "Personne, lieu, animal", shortLabel: "P" },
  blue: { label: "Objet", shortLabel: "O" },
  orange: { label: "Action", shortLabel: "A" },
  green: { label: "Mot difficile", shortLabel: "D" },
  red: { label: "Defi", shortLabel: "AP" },
};

const BOARD_PATH = [
  [5, 9],
  [5, 10],
  [5, 11],
  [4, 11],
  [3, 11],
  [2, 11],
  [1, 11],
  [1, 10],
  [1, 9],
  [1, 8],
  [1, 7],
  [2, 7],
  [3, 7],
  [3, 6],
  [3, 5],
  [2, 5],
  [1, 5],
  [1, 4],
  [1, 3],
  [1, 2],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [5, 2],
  [5, 3],
  [6, 3],
  [7, 3],
  [7, 2],
  [7, 1],
  [8, 1],
  [9, 1],
  [10, 1],
  [11, 1],
  [11, 2],
  [11, 3],
  [11, 4],
  [11, 5],
  [10, 5],
  [9, 5],
  [9, 6],
  [9, 7],
  [10, 7],
  [11, 7],
  [11, 8],
  [11, 9],
  [11, 10],
  [11, 11],
  [10, 11],
  [9, 11],
  [8, 11],
  [7, 11],
  [7, 10],
  [7, 9],
];

const CATEGORY_SEQUENCE = ["yellow", "blue", "orange", "green", "red"];

export function getBoardSquares() {
  return BOARD_PATH.map(([column, row], index) => {
    const category = CATEGORY_SEQUENCE[index % CATEGORY_SEQUENCE.length];
    return {
      index,
      category,
      column,
      row,
      label: BOARD_CATEGORIES[category].shortLabel,
      title:
        index === 0
          ? "Depart"
          : index === BOARD_MAX_INDEX
            ? "Arrivee"
            : BOARD_CATEGORIES[category].label,
    };
  });
}

export function computeNewPosition(target, max = BOARD_MAX_INDEX) {
  if (target <= max) return Math.max(0, target);
  return Math.max(0, max - (target - max));
}

export function rollDice(random = Math.random) {
  return Math.floor(random() * 6) + 1;
}

export function createGameState(playerCount = 2) {
  return {
    playerCount,
    currentPlayer: 0,
    currentDiceResult: 6,
    positions: Array.from({ length: 4 }, () => 0),
    hasStarted: false,
  };
}

export function setPlayerCount(state, playerCount) {
  return {
    ...state,
    playerCount,
    currentPlayer: 0,
    positions: Array.from({ length: 4 }, () => 0),
    hasStarted: true,
  };
}

export function selectPlayer(state, playerId) {
  if (playerId < 0 || playerId >= state.playerCount) return state;
  return { ...state, currentPlayer: playerId };
}

export function movePlayerBySteps(state, playerId, steps) {
  return movePlayerToPosition(state, playerId, state.positions[playerId] + steps);
}

export function movePlayerToPosition(state, playerId, target) {
  if (playerId < 0 || playerId >= state.playerCount) return state;

  const positions = [...state.positions];
  positions[playerId] = computeNewPosition(target);
  return { ...state, positions };
}
