export const CARD_CATEGORIES = {
  yellow: "Personne, lieu, animal",
  blue: "Objet",
  orange: "Action",
  green: "Mot difficile",
  red: "Defi",
};

export function validateCategories(categories) {
  if (!categories || typeof categories !== "object") {
    return { valid: false, message: "Le fichier de cartes est invalide." };
  }

  for (const color of Object.keys(CARD_CATEGORIES)) {
    if (!Array.isArray(categories[color]) || categories[color].length === 0) {
      return {
        valid: false,
        message: `La categorie ${color} est vide ou absente.`,
      };
    }
  }

  return { valid: true, message: "" };
}

export function drawCard(categories, random = Math.random) {
  const card = {};

  for (const color of Object.keys(CARD_CATEGORIES)) {
    const values = categories[color];
    card[color] = values[Math.floor(random() * values.length)];
  }

  return card;
}

export function createCardRoundState(duration = 60) {
  return {
    currentCard: null,
    timeRemaining: duration,
    isRunning: false,
    isRevealed: false,
  };
}

export function startCardRound(state, card, duration = 60) {
  return {
    ...state,
    currentCard: card,
    timeRemaining: duration,
    isRunning: true,
    isRevealed: true,
  };
}

export function revealCard(state) {
  if (!state.currentCard) return state;
  return { ...state, isRevealed: true };
}

export function hideCard(state) {
  return { ...state, isRevealed: false };
}

export function tickCardRound(state) {
  if (!state.isRunning) return state;

  const timeRemaining = Math.max(0, state.timeRemaining - 1);
  return {
    ...state,
    timeRemaining,
    isRunning: timeRemaining > 0,
  };
}

export function capitalizeFirstLetter(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
