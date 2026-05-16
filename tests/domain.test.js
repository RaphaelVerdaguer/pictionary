import assert from "node:assert/strict";
import test from "node:test";

import {
  BOARD_MAX_INDEX,
  computeNewPosition,
  createGameState,
  getBoardSquares,
  movePlayerBySteps,
  movePlayerToPosition,
  rollDice,
  setPlayerCount,
} from "../common/domain/board.js";
import { drawCard, validateCategories } from "../common/domain/cards.js";

test("board exposes 55 generated squares", () => {
  const squares = getBoardSquares();

  assert.equal(squares.length, 55);
  assert.equal(squares[0].index, 0);
  assert.equal(squares[BOARD_MAX_INDEX].index, BOARD_MAX_INDEX);
});

test("position computation clamps before start and bounces after finish", () => {
  assert.equal(computeNewPosition(-4), 0);
  assert.equal(computeNewPosition(12), 12);
  assert.equal(computeNewPosition(55), 53);
  assert.equal(computeNewPosition(60), 48);
});

test("moving a player updates only that player", () => {
  let state = setPlayerCount(createGameState(), 3);

  state = movePlayerBySteps(state, 1, 6);
  state = movePlayerToPosition(state, 2, 54);

  assert.deepEqual(state.positions, [0, 6, 54, 0]);
});

test("dice roll returns a value from 1 to 6", () => {
  assert.equal(rollDice(() => 0), 1);
  assert.equal(rollDice(() => 0.999), 6);
});

test("category validation detects missing categories", () => {
  const validation = validateCategories({ yellow: ["Paris"] });

  assert.equal(validation.valid, false);
});

test("card draw returns one value per category", () => {
  const categories = {
    yellow: ["Paris"],
    blue: ["Crayon"],
    orange: ["Courir"],
    green: ["Perspective"],
    red: ["Main gauche"],
  };

  assert.deepEqual(drawCard(categories, () => 0), {
    yellow: "Paris",
    blue: "Crayon",
    orange: "Courir",
    green: "Perspective",
    red: "Main gauche",
  });
});
