import Player from './player';
import {
  createBoard,
  drawShip,
  markCellAsFailedAttack,
  markCellAsSuccessfulAttack,
} from './ui';

export function placeShipForPlayer(player, ship, x, y, axis) {
  player.placeShip(ship, x, y, axis);
  const shipSize = player
    .getBoard()
    .getShips()
    .find((s) => s.type === ship).size;
  // console.log(player.getBoard().getCells());
  drawShip(player.getDomBoard(), shipSize, player.getColor(), x, y, axis);
}

export function makeAttack(attacker, target, x, y) {
  attacker.placeAttack(target.getBoard(), x, y);
  if (target.getBoard().getCells()[y][x] === 1) {
    markCellAsSuccessfulAttack(target.getDomBoard(), x, y);
  } else {
    markCellAsFailedAttack(target.getDomBoard(), x, y);
  }
}

const boardsContainer = document.getElementById('boards');
const playerOne = Player('player 1', 'blue');
const playerTwo = Player('player 2', 'red');

boardsContainer.append(playerOne.getDomBoard());
boardsContainer.append(playerTwo.getDomBoard());

placeShipForPlayer(playerOne, 'carrier', 0, 0, 'horizontal');
placeShipForPlayer(playerOne, 'battleship', 0, 6, 'vertical');
placeShipForPlayer(playerOne, 'destroyer', 4, 3, 'vertical');
placeShipForPlayer(playerOne, 'submarine', 9, 2, 'vertical');
placeShipForPlayer(playerOne, 'patrol boat', 2, 6, 'horizontal');

placeShipForPlayer(playerTwo, 'carrier', 0, 0, 'horizontal');
placeShipForPlayer(playerTwo, 'battleship', 0, 6, 'vertical');
placeShipForPlayer(playerTwo, 'destroyer', 4, 3, 'vertical');
placeShipForPlayer(playerTwo, 'submarine', 9, 2, 'vertical');
placeShipForPlayer(playerTwo, 'patrol boat', 2, 6, 'horizontal');

makeAttack(playerOne, playerTwo, 2, 1);
makeAttack(playerOne, playerTwo, 4, 3);
makeAttack(playerOne, playerTwo, 4, 4);
makeAttack(playerOne, playerTwo, 4, 5);
makeAttack(playerOne, playerTwo, 4, 6);
makeAttack(playerOne, playerTwo, 3, 6);
makeAttack(playerOne, playerTwo, 2, 6);
