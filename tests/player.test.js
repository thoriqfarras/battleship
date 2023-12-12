/* eslint-disable no-undef */
import Player from '../src/player';

test('place ship', () => {
  const playerOne = new Player('player 1');
  playerOne.placeShip('carrier', 1, 2);
  expect(playerOne.getBoard().getShips()[0].type).toMatch('carrier');
  expect(() => playerOne.placeShip('patrol boat', 1, 2, 'vertical')).toThrow(
    Error
  );
  expect(playerOne.getBoard().getShips().length).toBe(1);
});

test("place attack on enemy's board", () => {
  const playerOne = new Player('player 1');
  const playerTwo = new Player('player 2');
  playerTwo.placeShip('carrier', 1, 2);
  playerOne.placeAttack(playerTwo.getBoard(), 3, 2);
  expect(playerTwo.getBoard().getCells()[2][3]).toBe(1);
});

test('place attack randomly till board is full', () => {
  const playerOne = new Player('player 1');
  const computer = new Player('computer');
  for (let i = 0; i < 100; i += 1) {
    computer.placeAttack(playerOne.getBoard(), 0, 0, true);
  }
  expect(
    playerOne
      .getBoard()
      .getCells()
      .every((row) => row.every((col) => col === -1))
  ).toBeTruthy();
});
