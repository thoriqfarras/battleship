import Player from './player';

const boardsContainer = document.getElementById('boards');
const playerOne = new Player('player 1', 'blue');
const playerTwo = new Player('player 2', 'red');

boardsContainer.append(playerOne.getDomBoard());
boardsContainer.append(playerTwo.getDomBoard());

playerOne.placeShip('carrier', 0, 0);
playerOne.placeShip('battleship', 0, 6, 'vertical');
playerOne.placeShip('destroyer', 4, 3, 'vertical');
playerOne.placeShip('submarine', 9, 2, 'vertical');
playerOne.placeShip('patrol boat', 2, 6);

playerTwo.placeShip('carrier', 0, 0);
playerTwo.placeShip('battleship', 0, 6, 'vertical');
playerTwo.placeShip('destroyer', 4, 3, 'vertical');
playerTwo.placeShip('submarine', 9, 2, 'vertical');
playerTwo.placeShip('patrol boat', 2, 6);
