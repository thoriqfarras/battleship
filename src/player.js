import Gameboard from './gameboard';
import {
  createBoard,
  drawShip,
  markCellAsFailedAttack,
  markCellAsSuccessfulAttack,
} from './ui';
import Ship from './ship';

export default function Player(name, color) {
  const board = Gameboard();
  const domBoard = createBoard();

  function placeShip(type, x, y, axis = 'horizontal') {
    const ship = new Ship(type);
    try {
      board.placeShip(ship, x, y, axis);
      // drawShip(domBoard, ship, color, x, y, axis);
    } catch (error) {
      alert(error);
      console.log(error);
    }
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

    try {
      opponentBoard.receiveAttack(x, y);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  return {
    getName: () => name,
    getBoard: () => board,
    getDomBoard: () => domBoard,
    getColor: () => color,
    placeShip,
    placeAttack,
  };
}
