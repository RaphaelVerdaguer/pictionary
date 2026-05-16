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

export function capitalizeFirstLetter(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
