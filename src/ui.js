export function createBoard() {
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
    const cell = document.createElement('div');
    cell.classList.add('bg-white', 'cell');

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

export function drawShip(board, shipSize, color, x, y, axis = 'horizontal') {
  let head = +`${y}${x}`;
  const cells = Array.from(board.querySelectorAll('.cell'));
  if (axis === 'horizontal') {
    for (let i = 0; i < shipSize; i += 1) {
      cells[head].classList.remove('bg-white');
      cells[head].style.backgroundColor = color;
      // console.log(head);
      // console.log(cells[head]);
      head += 1;
    }
  } else if (axis === 'vertical') {
    for (let i = 0; i < shipSize; i += 1) {
      cells[head].classList.remove('bg-white');
      cells[head].style.backgroundColor = color;
      // console.log(head);
      // console.log(cells[head]);
      head += 10;
    }
  }
}

export function markCellAsSuccessfulAttack(domBoard, x, y) {
  const cellNo = +`${y}${x}`;
  const cells = Array.from(domBoard.querySelectorAll('.cell'));
  cells[cellNo].style.backgroundColor = 'green';
}

export function markCellAsFailedAttack(domBoard, x, y) {
  const cellNo = +`${y}${x}`;
  const cells = Array.from(domBoard.querySelectorAll('.cell'));
  cells[cellNo].style.backgroundColor = 'maroon';
}
