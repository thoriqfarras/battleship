import { placeShipForPlayer } from './game';
import GameController from './gameController';
import Player from './player';
import { createBoard } from './ui';

export default function domController() {
  const p1 = new Player('Player 1', 'blue');
  const p2 = new Player('Computer', 'red');
  const game = GameController(p1, p2);
  let gameOngoing = true;
  let [attacker, target] = game.getAttackerTarget();

  Object.assign(p1, { domBoard: createBoard() });
  Object.assign(p2, { domBoard: createBoard() });

  function initializeBoards() {
    const boardsContainer = document.getElementById('boards');
    const versusPara = document.getElementById('versus');
    boardsContainer.insertBefore(p1.domBoard, versusPara);
    boardsContainer.append(p2.domBoard);
    target.domBoard.classList.add('target-board');

    game.placeShip(p1, 'carrier', 0, 0, 'horizontal');
    game.placeShip(p1, 'battleship', 0, 6, 'vertical');
    game.placeShip(p1, 'destroyer', 4, 3, 'vertical');
    game.placeShip(p1, 'submarine', 9, 2, 'vertical');
    game.placeShip(p1, 'patrol boat', 2, 6, 'horizontal');

    game.placeShip(p2, 'carrier', 0, 0, 'horizontal');
    game.placeShip(p2, 'battleship', 0, 6, 'vertical');
    game.placeShip(p2, 'destroyer', 4, 3, 'vertical');
    game.placeShip(p2, 'submarine', 9, 2, 'vertical');
    game.placeShip(p2, 'patrol boat', 2, 6, 'horizontal');

    for (let i = 0; i < 50; i += 1) {
      p1.placeAttack(target.getBoard(), 0, 0, true);
    }
  }

  function cellNoToCoord(cell) {
    const cellNo = cell.dataset.index;
    if (cellNo < 10) {
      return [cellNo, 0];
    }
    return [cellNo % 10, Math.floor(cellNo / 10)];
  }

  function updatePlayerBoard(player) {
    const domBoard = player.domBoard.querySelectorAll('.cell');
    const board = player.getBoard().getCells();
    domBoard.forEach((cell) => {
      const [col, row] = cellNoToCoord(cell);
      if (board[row][col] === -1) {
        cell.style.backgroundColor = 'maroon';
      } else if (board[row][col] === 0) {
        cell.style.backgroundColor = 'white';
      } else if (board[row][col] === 1) {
        cell.style.backgroundColor = 'lime';
      } else {
        cell.style.backgroundColor = player.getColor();
      }
    });
  }

  function renderTextOntoMessagePanel(text) {
    const panel = document.getElementById('message-panel');
    panel.innerText = text;
  }

  function switchTargetBoard() {
    [attacker, target] = game.getAttackerTarget();
    target.domBoard.classList.add('target-board');
    attacker.domBoard.classList.remove('target-board');
  }

  function clickHandlerBoards(e) {
    if (
      e.target.parentElement.classList.contains('target-board') &&
      gameOngoing
    ) {
      try {
        const [x, y] = cellNoToCoord(e.target);
        const outcome = game.placeAttack(x, y);
        updatePlayerBoard(target);
        if (outcome === 0) {
          console.log('winner!');
          renderTextOntoMessagePanel(`${winner.getName()} won!`);
          gameOngoing = false;
          return 0;
        }
        if (outcome === 1) {
          console.log('hit!');
          renderTextOntoMessagePanel(
            `${attacker.getName()}'s attack on (${[x, y]}) is a hit!`
          );
        } else {
          renderTextOntoMessagePanel(
            `${attacker.getName()}'s attack on (${[x, y]}) is a miss.`
          );
        }
        setTimeout(() => {
          switchTargetBoard();
          renderTextOntoMessagePanel(`${attacker.getName()}'s turn.`);
        }, 2000);
      } catch (error) {
        if (error.message === 'coords already attacked') {
          renderTextOntoMessagePanel(
            `Cell is already attacked. Try again ${attacker.getName()}`
          );
        }
      }
    }
  }

  initializeBoards();
  updatePlayerBoard(p1);
  updatePlayerBoard(p2);

  renderTextOntoMessagePanel(`${attacker.getName()}'s turn.`);
  p1.domBoard.addEventListener('click', clickHandlerBoards);
  p2.domBoard.addEventListener('click', clickHandlerBoards);
}

domController();
