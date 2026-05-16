import { validateCategories } from "../domain/cards.js";

export async function loadCategories(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Impossible de charger les cartes.");
  }

  const categories = await response.json();
  const validation = validateCategories(categories);

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  return categories;
}
