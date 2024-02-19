import Gameboard from './gameboard';
import Ship from './ship';

export default function Player(name, color) {
  let board = Gameboard();
  // const domBoard = createBoard();

  function placeShip(type, x, y, axis = 'horizontal', random = false) {
    const ship = new Ship(type);
    if (random) {
      while (random) {
        const randX = Math.floor(Math.random() * 10);
        const randY = Math.floor(Math.random() * 10);
        const randAxis = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        try {
          board.placeShip(ship, randX, randY, randAxis);
          return ship;
        } catch (error) {
          if (error.message.includes('invalid placement')) {
            continue;
          }
        }
      }
    } else {
      board.placeShip(ship, x, y, axis);
    }
    return ship;
  }

  function placeAttack(opponentBoard, x, y, random = false) {
    while (random) {
      const randX = Math.floor(Math.random() * 10);
      const randY = Math.floor(Math.random() * 10);
      try {
        opponentBoard.receiveAttack(randX, randY);
        return { x: randX, y: randY };
      } catch (error) {
        if (error.message === 'coords already attacked') continue;
      }
    }
    opponentBoard.receiveAttack(x, y);
    return { x, y };
  }

  function resetBoard() {
    board = Gameboard();
  }

  return {
    getName: () => name,
    getBoard: () => board,
    getColor: () => color,
    placeShip,
    placeAttack,
    resetBoard,
  };
}
