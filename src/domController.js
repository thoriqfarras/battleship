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
  let p1 = null;
  let p2 = null;
  let game = null;
  let gameMode = 0; // 0: vs com, 1: coop.
  let gameOngoing = false;
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
  let playerPlacingShips = null;
  let [attacker, target] = [];
  let shipsHidden = true;

  let activePopup = {};
  const controlSection = document.getElementById('controls');
  const popUpGoHomeBackdrop = document.getElementById('popup-go-home');

  function clearAllChildElements(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  function hideAllChildElements(parentId) {
    const children = Array.from(document.getElementById(parentId).children);
    children.forEach((child) => {
      child.classList.add('hidden');
    });
  }

  function hideElementById(id) {
    const element = document.getElementById(id);
    element.classList.add('hidden');
  }

  function unhideElementById(id) {
    const element = document.getElementById(id);
    element.classList.remove('hidden');
  }

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
      if ((indexToDraw + size) % 10 < size && (indexToDraw + size) % 10 !== 0) {
        return;
      }
      for (let i = 0; i < size; i += 1) {
        cells[indexToDraw].style.filter = 'brightness(50%)';
        indexToDraw += 1;
      }
    } else if (axis === 'vertical') {
      if (indexToDraw + (size - 1) * 10 > 99) {
        return;
      }
      for (let i = 0; i < size; i += 1) {
        cells[indexToDraw].style.filter = 'brightness(50%)';
        indexToDraw += 10;
      }
    }
  }

  function updatePlayerBoard(player, hideShips = false) {
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
      } else if (!hideShips) {
        cell.style.backgroundColor = player.getColor();
      } else {
        cell.style.backgroundColor = 'white';
      }
      cell.style.filter = '';
    });
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
      currentTargetText.forEach((ship) => {
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
    domBoard.querySelectorAll('.cell').forEach((cell) => {
      if (cell.style.pointerEvents !== 'none') {
        cell.style.pointerEvents = 'none';
      } else {
        cell.style.pointerEvents = 'auto';
      }
    });
  }

  function switchTurn() {
    return new Promise((resolve) => {
      setTimeout(() => {
        switchTargetBoard();
        if (attacker.getName() !== 'Computer') {
          togglePointerEventsOnBoard(target.domBoard);
        }
        renderTextOntoMessagePanel(`${attacker.getName()}'s turn.`);
      }, 2000);
      setTimeout(() => {
        shipsHidden = true;
        updatePlayerBoard(target, shipsHidden);
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
      updatePlayerBoard(target, true);
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

  function resetPlayerShipsText() {
    const p1ShipsText = Array.from(
      document.getElementById('player-one-ships').querySelectorAll('li')
    );
    const p2ShipsText = Array.from(
      document.getElementById('player-two-ships').querySelectorAll('li')
    );

    p1ShipsText.forEach((ship) => {
      ship.classList.remove('line-through');
      ship.classList.add('text-zinc-400');
    });
    p2ShipsText.forEach((ship) => {
      ship.classList.remove('line-through');
      ship.classList.add('text-zinc-400');
    });
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
          updatePlayerBoard(p2, true);
          renderTextOntoMessagePanel(`${attacker.getName()}'s turn.`);
          hideAllChildElements('controls');
          unhideElementById('go-home');
          unhideElementById('toggle-ship-view');
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
                playerPlacingShips = false;
                gameOngoing = true;
                togglePointerEventsOnBoard(p2.domBoard);
                renderTextOntoMessagePanel(`${attacker.getName()}'s turn.`);
                hideAllChildElements('controls');
                unhideElementById('go-home');
              }, 4000);
            })();
          } else {
            updatePlayerBoard(p1, true);
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
  }

  function resetGameVariables() {
    p1 = null;
    p2 = null;
    game = null;
    gameMode = 0;
    gameOngoing = false;
    placementAxis = 'horizontal';
    shipToPlaceIndex = 0;
    shipToPlace = ships[shipToPlaceIndex];
    playerPlacingShips = null;
    [attacker, target] = [];
    shipsHidden = true;
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
    hideElementById('game-info');
    hideElementById('boards');
    hideAllChildElements('controls');
    unhideElementById('play-vs-com');
    unhideElementById('play-coop');
  }

  function loadPlayerCustomizationForm() {
    hideAllChildElements('controls');
    unhideElementById('player-customization-form');
    const form = controlSection.querySelector('form');
    Array.from(form.children).forEach((child) => {
      if (child.tagName === 'INPUT' && child.type === 'text') {
        child.value = '';
      }
      if (
        child.id.includes('player-two') ||
        child.htmlFor?.includes('player-two') ||
        child.innerText.includes('Player 2')
      ) {
        if (gameMode === 0) {
          child.classList.add('hidden');
        } else {
          child.classList.remove('hidden');
        }
      }
    });
  }

  function setPlayerNameOnGameInfo(playerNumber, playerName) {
    if (playerNumber === 1) {
      const para = document.getElementById('player-one-name-info');
      para.innerText = playerName;
    }
    if (playerNumber === 2) {
      const para = document.getElementById('player-two-name-info');
      para.innerText = playerName;
    }
  }

  function getFormInputs() {
    const form = document.querySelector('form');
    return {
      p1Name: form.querySelector('#player-one-name').value,
      p1Color: form.querySelector('#player-one-color').value,
      p2Name:
        gameMode === 1 ? form.querySelector('#player-two-name').value : null,
      p2Color:
        gameMode === 1 ? form.querySelector('#player-two-color').value : null,
    };
  }

  function startGame(formInputs) {
    p1 = new Player(formInputs.p1Name, formInputs.p1Color);
    p2 =
      gameMode === 1
        ? new Player(formInputs.p2Name, formInputs.p2Color)
        : new Player('Computer', 'red');
    game = GameController(p1, p2);
    playerPlacingShips = p1;
    [attacker, target] = game.getAttackerTarget();
    shipToPlaceIndex = 0;
    shipToPlace = ships[shipToPlaceIndex];

    Object.assign(p1, { domBoard: createBoard() });
    Object.assign(p2, { domBoard: createBoard() });

    initializeBoards();

    setPlayerNameOnGameInfo(1, p1.getName());
    setPlayerNameOnGameInfo(2, p2.getName());
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
      cell.addEventListener('mouseleave', () => {
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
      cell.addEventListener('mouseleave', () => {
        if (playerPlacingShips === p2) {
          updatePlayerBoard(p2);
        }
      });
    });
  }

  function controlSectionHandler(e) {
    if (e.target.id === 'play-vs-com') {
      gameMode = 0;
      loadPlayerCustomizationForm();
    } else if (e.target.id === 'play-coop') {
      gameMode = 1;
      loadPlayerCustomizationForm();
    } else if (e.target.id === 'start-game') {
      const formInputs = getFormInputs();
      unhideElementById('boards');
      unhideElementById('game-info');
      hideAllChildElements('controls');
      unhideElementById('rotate-ship');
      startGame(formInputs);
    } else if (e.target.id === 'rotate-ship') {
      placementAxis =
        placementAxis === 'horizontal' ? 'vertical' : 'horizontal';
    } else if (e.target.id === 'go-home') {
      if (!gameOngoing) {
        const boardsContainer = document.getElementById('boards');
        clearAllChildElements(boardsContainer);
        loadStartPage();
        resetGameVariables();
        resetPlayerShipsText();
      } else {
        displayPopup(popUpGoHomeBackdrop);
      }
    } else if (e.target.id === 'back-home') {
      hideAllChildElements('controls');
      loadStartPage();
    } else if (e.target.id === 'toggle-ship-view') {
      shipsHidden = !shipsHidden;
      updatePlayerBoard(attacker, shipsHidden);
    }
  }

  popUpGoHomeBackdrop.addEventListener('click', (e) => {
    if (
      (activePopup && e.target.classList.contains('popup-backdrop')) ||
      e.target.classList.contains('popup-no')
    ) {
      closePopup();
    } else if (
      (activePopup && e.target.classList.contains('popup-backdrop')) ||
      e.target.classList.contains('popup-yes')
    ) {
      closePopup();
      p1.domBoard.remove();
      p2.domBoard.remove();
      loadStartPage();
      resetGameVariables();
      resetPlayerShipsText();
    }
  });

  controlSection.addEventListener('click', controlSectionHandler);
}
