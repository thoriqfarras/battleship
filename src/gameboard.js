export default function Gameboard() {
  const board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const ships = [];
  const successfulAttacks = [];
  const missedAttacks = [];

  function getShips() {
    return ships;
  }

  function isValidCoord(...coord) {
    return coord.every((point) => point >= 0 && point < 10);
  }

  function placeShip(ship, x, y, axis = 'horizontal') {
    if (!isValidCoord(x, y))
      throw new Error(
        'invalid coordinates. Coordinates can only be within [0, 0] and [9, 9] inclusive'
      );
    if (axis === 'horizontal') {
      if (ship.type === 'carrier' && x > 5)
        throw new Error(
          'invalid placement. Carrier cannot be placed horizontally beyond x = 5'
        );
      else if (ship.type === 'battleship' && x > 6)
        throw new Error(
          'invalid placement. Battleship cannot be placed horizontally beyond x = 6'
        );
      else if (
        (ship.type === 'destroyer' || ship.type === 'submarine') &&
        x > 7
      )
        throw new Error(
          'invalid placement. Battleship cannot be placed horizontally beyond x = 7'
        );
      else if (ship.type === 'patrol boat' && x > 8)
        throw new Error(
          'invalid placement. Battleship cannot be placed horizontally beyond x = 8'
        );
      for (let i = 0; i < ship.size; i += 1) {
        if (board[y][x + i] !== 0) {
          throw new Error(`invalid placement. Cell (${x}, ${y}) is occupied`);
        }
        board[y][x + i] = ship.type;
      }
    } else if (axis === 'vertical') {
      if (ship.type === 'carrier' && y > 5)
        throw new Error(
          'invalid placement. Carrier cannot be placed horizontally under y = 5'
        );
      else if (ship.type === 'battleship' && y > 6)
        throw new Error(
          'invalid placement. Battleship cannot be placed horizontally under y = 4'
        );
      else if (
        (ship.type === 'destroyer' || ship.type === 'submarine') &&
        y > 7
      )
        throw new Error(
          'invalid placement. Battleship cannot be placed horizontally under x = 3'
        );
      else if (ship.type === 'patrol boat' && y > 8)
        throw new Error(
          'invalid placement. Battleship cannot be placed horizontally under x = 2'
        );
      for (let i = 0; i < ship.size; i += 1) {
        if (board[y + i][x] !== 0) {
          throw new Error(`invalid placement. Cell (${x}, ${y}) is occupied`);
        }
        board[y + i][x] = ship.type;
      }
    }
    ships.push(ship);
  }

  function receiveAttack(coord) {
    if (!isValidCoord(coord))
      throw new Error(
        'invalid coordinates. Coordinates can only be within [0, 0] and [9, 9] inclusive'
      );
  }

  function isCoordEmpty(coord) {
    return board[coord[0]][coord[1]] === 0;
  }

  return { getShips, placeShip, isCoordEmpty, coords: board };
}
