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
  let gameMode = 0; // 0: vs com, 1: coop.
  let gameOngoing = false;
  let playerPlacingShips = p1;
  let placementAxis = 'horizontal';
  const ships = [
    'carrier',
    'battleship',
    'destroyer',
    'submarine',
    'patrol boat',
  ];
  let shipToPlaceIndex = 0;
  let shipToPlace = ships[shipToPlaceIndex];
  let [attacker, target] = game.getAttackerTarget();

  Object.assign(p1, { domBoard: createBoard() });
  Object.assign(p2, { domBoard: createBoard() });

  let activePopup = {};
  const controlSection = document.getElementById('controls');
  const popUpGoHomeBackdrop = document.getElementById('popup-go-home');

  function cellNoToCoord(cell) {
    const cellNo = cell.dataset.index;
    if (cellNo < 10) {
      return [cellNo, 0];
    }
    return [cellNo % 10, Math.floor(cellNo / 10)];
  }

  function drawShip(type, domBoard, cellIndex, axis) {
    let size = 0;
    if (type === 'carrier') {
      size = 5;
    } else if (type === 'battleship') {
      size = 4;
    } else if (type === 'destroyer') {
      size = 3;
    } else if (type === 'submarine') {
      size = 3;
    } else if (type === 'patrol boat') {
      size = 2;
    }

    const cells = Array.from(domBoard.querySelectorAll('.cell'));
    let indexToDraw = +cellIndex;
    if (axis === 'horizontal') {
      console.log('horizontal');
      if ((indexToDraw + size) % 10 < size && (indexToDraw + size) % 10 !== 0) {
        console.log('out of bounds.', cellIndex, indexToDraw + size);
        return;
      }
      for (let i = 0; i < size; i += 1) {
        cells[indexToDraw].style.filter = 'brightness(50%)';
        indexToDraw += 1;
      }
    } else if (axis === 'vertical') {
      if (indexToDraw + (size - 1) * 10 > 99) {
        console.log('out of bounds.', cellIndex, indexToDraw + (size - 1) * 10);
        return;
      }
      for (let i = 0; i < size; i += 1) {
        cells[indexToDraw].style.filter = 'brightness(50%)';
        indexToDraw += 10;
      }
    }
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
      cell.style.filter = '';
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
      // paused = true;
      setTimeout(() => {
        // paused = false;
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
    });
    console.log('hello');
  }

  function switchTurn() {
    return new Promise((resolve) => {
      setTimeout(() => {
        switchTargetBoard();
        if (attacker.getName() !== 'Computer') {
          togglePointerEventsOnBoard(target.domBoard);
          console.log('HelloWank');
        }
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

    let outcome = {};
    try {
      outcome = game.placeAttack(x, y, isComputer);
      updatePlayerBoard(target);
      updatePlayerShipsText();
      togglePointerEventsOnBoard(target.domBoard);
    } catch (error) {
      if (error.message === 'coords already attacked') {
        renderTextOntoMessagePanel(
          `(${[x, y]}) is already attacked. Try again.`
        );
        return 0;
      }
      throw error;
    }
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

  function updatePlayerShipsText(index = shipToPlaceIndex) {
    const p1ShipsText = Array.from(
      document.getElementById('player-one-ships').querySelectorAll('li')
    );
    const p2ShipsText = Array.from(
      document.getElementById('player-two-ships').querySelectorAll('li')
    );

    if (gameOngoing) {
      let currentTargetText = [];
      if (target === p1) {
        currentTargetText = p1ShipsText;
      } else if (target === p2) {
        currentTargetText = p2ShipsText;
      }
      const targetShips = target
        .getBoard()
        .getShips()
        .map((ship) => ship.type);
      console.log(targetShips);
      currentTargetText.forEach((ship) => {
        console.log(ship.innerText.toLowerCase());
        if (!targetShips.includes(ship.innerText.toLowerCase())) {
          ship.classList.add('line-through');
        }
      });
    }

    if (playerPlacingShips === p1) {
      p1ShipsText[index].classList.remove('text-zinc-400');
    } else if (playerPlacingShips === p2) {
      p2ShipsText[index].classList.remove('text-zinc-400');
    }
  }

  async function clickHandlerBoards(e) {
    if (
      e.target.parentElement.classList.contains('target-board') &&
      playerPlacingShips
    ) {
      try {
        const [x, y] = cellNoToCoord(e.target);
        game.placeShip(playerPlacingShips, shipToPlace, x, y, placementAxis);
        updatePlayerBoard(playerPlacingShips);
        updatePlayerShipsText();
        shipToPlaceIndex += 1;
        if (shipToPlaceIndex === 5 && playerPlacingShips === p2) {
          playerPlacingShips = false;
          gameOngoing = true;
          renderTextOntoMessagePanel(`${attacker.getName()}'s turn.`);
          return;
        }
        if (shipToPlaceIndex === 5) {
          shipToPlaceIndex = 0;
          playerPlacingShips = p2;
          if (playerPlacingShips.getName() === 'Computer') {
            togglePointerEventsOnBoard(p2.domBoard);
            renderTextOntoMessagePanel('Computer is placing its ships...');
            await (async () => {
              setTimeout(() => {
                for (let i = 0; i < ships.length; i += 1) {
                  game.placeShip(playerPlacingShips, ships[i], 0, 0, '', true);
                  updatePlayerShipsText(i);
                }
                console.log(playerPlacingShips.getBoard().getCells());
                updatePlayerBoard(p2);
                playerPlacingShips = false;
                gameOngoing = true;
                togglePointerEventsOnBoard(p2.domBoard);
                renderTextOntoMessagePanel(`${attacker.getName()}'s turn.`);
              }, 4000);
            })();
          }
          switchTargetBoard();
          togglePointerEventsOnBoard(p1.domBoard);
          togglePointerEventsOnBoard(p2.domBoard);
        }
        shipToPlace = ships[shipToPlaceIndex];
        if (playerPlacingShips.getName() !== 'Computer') {
          renderTextOntoMessagePanel(
            `${playerPlacingShips.getName()}, place your ${shipToPlace}.`
          );
        }
        return;
      } catch (error) {
        if (error.message.includes('occupied')) {
          renderTextOntoMessagePanel(
            `Placement overlaps occupied cells. Try again.`
          );
          return;
        }
        if (error.message.includes('invalid')) {
          renderTextOntoMessagePanel(`Placement out of bound. Try again.`);
          return;
        }
        throw error;
      }
    }

    if (
      e.target.parentElement.classList.contains('target-board') &&
      gameOngoing &&
      attacker.getName() !== 'Computer'
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
    attacker.domBoard.classList.add('target-board');
    togglePointerEventsOnBoard(p2.domBoard);

    // game.placeShip(p1, 'carrier', 0, 0, 'horizontal');
    // game.placeShip(p1, 'battleship', 0, 6, 'vertical');
    // game.placeShip(p1, 'destroyer', 4, 3, 'vertical');
    // game.placeShip(p1, 'submarine', 9, 2, 'vertical');
    // game.placeShip(p1, 'patrol boat', 2, 6, 'horizontal');

    // game.placeShip(p2, 'carrier', 0, 0, 'horizontal');
    // game.placeShip(p2, 'battleship', 0, 6, 'vertical');
    // game.placeShip(p2, 'destroyer', 4, 3, 'vertical');
    // game.placeShip(p2, 'submarine', 9, 2, 'vertical');
    // game.placeShip(p2, 'patrol boat', 2, 6, 'horizontal');

    // for (let i = 0; i < 50; i += 1) {
    //   p1.placeAttack(target.getBoard(), 0, 0, true);
    // }
  }

  function displayPopup(popupBackdrop) {
    popupBackdrop.classList.remove('hidden');
    activePopup = popupBackdrop;
  }

  function closePopup() {
    activePopup.classList.add('hidden');
    activePopup = {};
  }

  function loadStartPage() {
    const playVsComBtn = `<button
        id="play-vs-com"
        type="button"
        class="bg-zinc-800 rounded-xl p-4 text-zinc-50 font-bold text-2xl hover:bg-zinc-600"
      >
        Play vs COM
      </button>`;
    const playCoopBtn = `<button
        id="play-coop"
        type="button"
        class="bg-zinc-800 rounded-xl p-4 text-zinc-50 font-bold text-2xl hover:bg-zinc-600"
      >
        Play Coop
      </button>`;
    controlSection.innerHTML += playVsComBtn;
    controlSection.innerHTML += playCoopBtn;
  }

  function loadPlayerCustomizationForm(gameMode) {
    controlSection.innerHTML += `<form class="grid grid-cols-1 gap-x-2">
      <h2 class="text-xl col-span-2 font-bold">Player 1</h2>
      <label for="player-one-name" class="self-end">
        Name
      </label>
      <label for="player-one-color" class="col-start-2 self-end">
        Color
      </label>
      <input
        type="text"
        id="player-one-name"
        class="min-w-[250px] mb-4 h-8 rounded-xl border-zinc-300 border-2 pl-2 col-start-1"
        placeholder="Player 1"
      />
      <input
        type="color"
        value="#1d4ed8"
        class="border-2 border-zinc-300"
        id="player-one-color"
      />
      <h2 class="text-xl col-span-2 font-bold">Player 2</h2>
      <label for="player-two-name" class="self-end">
        Name
      </label>
      <label for="player-two-color" class="self-end">
        Color
      </label>
      <input
        type="text"
        id="player-two-name"
        class="min-w-[250px] h-8 rounded-xl border-zinc-300 border-2 pl-2 mb-4"
        placeholder="Player 2"
      />
      <input
        type="color"
        value="#b91c1c"
        class="border-2 border-zinc-300"
        id="player-two-color"
      />
      <button
        id="start-game"
        type="button"
        class="bg-zinc-800 rounded-xl p-3 text-zinc-50 font-bold text-xl hover:bg-zinc-600 w-fit place-self-center col-span-2"
      >
        Play
      </button>
    </form>`;
    if (gameMode === 0) {
      const form = controlSection.querySelector('form');
      Array.from(form.children).forEach((child) => {
        if (
          child.id.includes('player-two') ||
          child.htmlFor?.includes('player-two') ||
          child.innerText.includes('Player 2')
        ) {
          child.style.display = 'none';
        }
      });
    }
  }

  function clearAllChildElements(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  function controlSectionHandler(e) {
    if (e.target.id === 'play-vs-com') {
      gameMode = 0;
      clearAllChildElements(controlSection);
      loadPlayerCustomizationForm(gameMode);
    } else if (e.target.id === 'play-coop') {
      gameMode = 1;
      clearAllChildElements(controlSection);
      loadPlayerCustomizationForm(gameMode);
    } else if (e.target.id === 'start-game') {
      const playerOneName =
        controlSection.querySelector('#player-one-name').value;
      const playerOneColor =
        controlSection.querySelector('#player-one-color').value;
      if (gameMode === 1) {
        const playerTwoName =
          controlSection.querySelector('#player-two-name').value;
        const playerTwoColor =
          controlSection.querySelector('#player-two-color').value;
      }
    } else if (e.target.id === 'rotate-ship') {
      placementAxis =
        placementAxis === 'horizontal' ? 'vertical' : 'horizontal';
      console.log(placementAxis);
    }
  }

  // loadStartPage();
  initializeBoards();
  // updatePlayerBoard(p1);
  // updatePlayerBoard(p2);

  // renderTextOntoMessagePanel(`${attacker.getName()}'s turn.`);
  renderTextOntoMessagePanel(`${attacker.getName()}, place your carrier.`);
  p1.domBoard.addEventListener('click', clickHandlerBoards);
  p2.domBoard.addEventListener('click', clickHandlerBoards);

  const p1DomBoardCells = p1.domBoard.querySelectorAll('.cell');
  const p2DomBoardCells = p2.domBoard.querySelectorAll('.cell');
  p1DomBoardCells.forEach((cell) => {
    cell.addEventListener('mouseenter', (e) => {
      if (playerPlacingShips === p1) {
        drawShip(
          shipToPlace,
          p1.domBoard,
          e.target.dataset.index,
          placementAxis
        );
      }
    });
    cell.addEventListener('mouseleave', (e) => {
      if (playerPlacingShips === p1) {
        updatePlayerBoard(p1);
      }
    });
  });
  p2DomBoardCells.forEach((cell) => {
    cell.addEventListener('mouseenter', (e) => {
      if (playerPlacingShips === p2) {
        drawShip(
          shipToPlace,
          p2.domBoard,
          e.target.dataset.index,
          placementAxis
        );
      }
    });
    cell.addEventListener('mouseleave', (e) => {
      if (playerPlacingShips === p2) {
        updatePlayerBoard(p2);
      }
    });
  });

  controlSection.addEventListener('click', (e) => {
    if (e.target.id === 'go-home') {
      displayPopup(popUpGoHomeBackdrop);
    }
  });
  popUpGoHomeBackdrop.addEventListener('click', (e) => {
    if (
      (activePopup && e.target.classList.contains('popup-backdrop')) ||
      e.target.classList.contains('popup-no')
    ) {
      closePopup();
    }
  });
  controlSection.addEventListener('click', controlSectionHandler);
}

domController();
