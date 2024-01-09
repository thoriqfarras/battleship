import { placeShipForPlayer } from './game';
import GameController from './gameController';
import Player from './player';

function createBoard() {
  const CELL_WIDTH_PX = 40;
  const CELL_HEIGHT_PX = 40;
  const board = document.createElement('div');
  board.classList.add(
    'grid',
    `grid-rows-10`,
    `grid-cols-10`,
    'border-4',
    'border-black',
    `w-fit`
  );
  for (let i = 0; i < 100; i += 1) {
    const cell = document.createElement('button');
    cell.classList.add('bg-white', 'cell');
    cell.dataset.index = i;

    // had to manually set style. somehow it doesn't work with tailwind classes.
    cell.style.width = `${CELL_WIDTH_PX}px`;
    cell.style.height = `${CELL_HEIGHT_PX}px`;
    if (i < 90) {
      cell.classList.add('border-b-2', 'border-b-zinc-400');
    }
    if ((i + 1) % 10 !== 0) {
      cell.classList.add('border-r-2', 'border-r-zinc-400');
    }
    board.append(cell);
  }

  return board;
}

export default function domController() {
  const p1 = new Player('Player 1', 'blue');
  const p2 = new Player('Computer', 'red');
  const game = GameController(p1, p2);
  let gameOngoing = true;
  let [attacker, target] = game.getAttackerTarget();

  Object.assign(p1, { domBoard: createBoard() });
  Object.assign(p2, { domBoard: createBoard() });

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

  function renderComputerIsThinkingText() {
    return new Promise((resolve) => {
      renderTextOntoMessagePanel(`${attacker.getName()} is thinking...`);
      setTimeout(() => {
        resolve(1);
      }, 2000);
    });
  }

  function togglePointerEventsOnBoard(domBoard) {
    // console.log(domBoard);
    domBoard.querySelectorAll('.cell').forEach((cell) => {
      // console.log(cell.style.pointerEvents);
      if (cell.style.pointerEvents !== 'none') {
        cell.style.pointerEvents = 'none';
      } else {
        cell.style.pointerEvents = 'auto';
      }
      console.log(cell.style.pointerEvents);
    });
  }

  function switchTurn() {
    return new Promise((resolve) => {
      setTimeout(() => {
        switchTargetBoard();
        togglePointerEventsOnBoard(attacker.domBoard);
        togglePointerEventsOnBoard(target.domBoard);
        renderTextOntoMessagePanel(`${attacker.getName()}'s turn.`);
      }, 2000);
      setTimeout(() => {
        resolve(1);
      }, 2000);
    });
  }

  async function playTurn(x, y, isComputer = false) {
    if (isComputer) {
      await renderComputerIsThinkingText();
    }

    const outcome = game.placeAttack(x, y, isComputer);
    updatePlayerBoard(target);
    if (outcome.code === 0) {
      console.log('winner!');
      renderTextOntoMessagePanel(`${attacker.getName()} won!`);
      gameOngoing = false;
      return 0;
    }
    if (outcome.code === 1) {
      renderTextOntoMessagePanel(
        `${attacker.getName()}'s attack on (${[
          outcome.x,
          outcome.y,
        ]}) is a hit!`
      );
    } else {
      renderTextOntoMessagePanel(
        `${attacker.getName()}'s attack on (${[
          outcome.x,
          outcome.y,
        ]}) is a miss.`
      );
    }
    await switchTurn();

    return 1;
  }

  async function clickHandlerBoards(e) {
    if (
      e.target.parentElement.classList.contains('target-board') &&
      gameOngoing
    ) {
      try {
        const [x, y] = cellNoToCoord(e.target);
        playTurn(x, y).then(() => {
          if (attacker.getName() === 'Computer') {
            playTurn(0, 0, true);
          }
        });
      } catch (error) {
        if (error.message === 'coords already attacked') {
          renderTextOntoMessagePanel(
            `Cell is already attacked. Try again ${attacker.getName()}`
          );
        }
      }
    }
  }

  function initializeBoards() {
    const boardsContainer = document.getElementById('boards');
    const versusPara = document.getElementById('versus');
    boardsContainer.insertBefore(p1.domBoard, versusPara);
    boardsContainer.append(p2.domBoard);
    target.domBoard.classList.add('target-board');
    togglePointerEventsOnBoard(p1.domBoard);

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

  initializeBoards();
  updatePlayerBoard(p1);
  updatePlayerBoard(p2);

  renderTextOntoMessagePanel(`${attacker.getName()}'s turn.`);
  p2.domBoard.addEventListener('click', clickHandlerBoards);
  if (p2.getName() !== 'Computer') {
    p1.domBoard.addEventListener('click', clickHandlerBoards);
  }
}

domController();
