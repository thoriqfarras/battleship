import Gameboard from './gameboard';
import Ship from './ship';

export default function Player(name) {
  const board = Gameboard();

  function placeShip(type, x, y, axis = 'horizontal') {
    const ship = new Ship(type);
    board.placeShip(ship, x, y, axis);
  }

  function placeAttack(opponentBoard, x, y, random = false) {
    while (random) {
      const randX = Math.floor(Math.random() * 10);
      const randY = Math.floor(Math.random() * 10);
      try {
        opponentBoard.receiveAttack(randX, randY);
        return;
      } catch (error) {
        if (error.message === 'coords already attacked') continue;
      }
    }

    opponentBoard.receiveAttack(x, y);
  }

  return { getName: () => name, getBoard: () => board, placeShip, placeAttack };
}
