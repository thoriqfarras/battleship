/* eslint-disable no-undef */
import Gameboard from '../src/gameboard';
import Ship from '../src/ship';

test('getShips return empty list when board first initialized', () => {
  expect(Gameboard().getShips().length).toBe(0);
});

const globalBoard = Gameboard();
const carrier = new Ship('carrier');
const battleship = new Ship('battleship');
const destroyer = new Ship('destroyer');
const submarine = new Ship('submarine');
const patrol = new Ship('patrol boat');

describe('placeShip() method', () => {
  test('throws error with invalid coord', () => {
    expect(() => Gameboard().placeShip(new Ship('carrier'), 10, 10)).toThrow(
      Error
    );
  });

  describe('carrier placement', () => {
    test('successfully placed horizontally on 0 <= x <= 5', () => {
      const board = Gameboard();
      board.placeShip(carrier, 5, 0);
      for (let i = 5; i < carrier.size; i += 1)
        expect(board.getCells()[0][i]).toMatch('carrier');
    });

    test('successfully placed vertically on 0 <= y <= 5', () => {
      const board = Gameboard();
      board.placeShip(carrier, 0, 5, 'vertical');
      for (let i = 5; i < carrier.size; i += 1) {
        expect(board.getCells()[i][0]).toMatch('carrier');
      }
    });

    test('error when placed horizontally on x > 5', () => {
      expect(() => globalBoard.placeShip(carrier, 6, 0)).toThrow(Error);
      expect(() => globalBoard.placeShip(carrier, 7, 5)).toThrow(Error);
    });

    test('error when placed veritcally on y > 5', () => {
      expect(() => globalBoard.placeShip(carrier, 0, 6, 'vertical')).toThrow(
        Error
      );
      expect(() => globalBoard.placeShip(carrier, 9, 7, 'vertical')).toThrow(
        Error
      );
    });
  });

  describe('battleship placement', () => {
    test('successfully placed horizontally on 0 <= x <= 6', () => {
      const board = Gameboard();
      board.placeShip(battleship, 6, 6);
      for (let i = 0; i < battleship.size; i += 1) {
        expect(board.getCells()[6][6 + i]).toMatch('battleship');
      }
    });

    test('successfully placed vertically on 0 <= y <= 6', () => {
      const board = Gameboard();
      board.placeShip(battleship, 8, 6, 'vertical');
      for (let i = 0; i < battleship.size; i += 1) {
        expect(board.getCells()[6 + i][8]).toMatch('battleship');
      }
    });

    test('error when placed horizontally on x > 6', () => {
      expect(() => globalBoard.placeShip(battleship, 7, 0)).toThrow(Error);
      expect(() => globalBoard.placeShip(battleship, 7, 9)).toThrow(Error);
    });

    test('error when placed vertically on y > 6', () => {
      expect(() => globalBoard.placeShip(battleship, 9, 8, 'vertical')).toThrow(
        Error
      );
      expect(() => globalBoard.placeShip(battleship, 0, 9, 'vertical')).toThrow(
        Error
      );
    });
  });

  describe('destroyer and submarine placement', () => {
    test('successfully placed horizontally on 0 <= x <= 7', () => {
      const board = Gameboard();
      board.placeShip(destroyer, 7, 6);
      for (let i = 0; i < destroyer.size; i += 1) {
        expect(board.getCells()[6][7 + i]).toMatch('destroyer');
      }
      board.placeShip(submarine, 0, 6);
      for (let i = 0; i < submarine.size; i += 1) {
        expect(board.getCells()[6][0 + i]).toMatch('submarine');
      }
    });

    test('successfully placed vertically on 0 <= y <= 7', () => {
      const board = Gameboard();
      board.placeShip(destroyer, 0, 7, 'vertical');
      for (let i = 0; i < destroyer.size; i += 1) {
        expect(board.getCells()[7 + i][0]).toMatch('destroyer');
      }
      board.placeShip(submarine, 1, 7, 'vertical');
      for (let i = 0; i < destroyer.size; i += 1) {
        expect(board.getCells()[7 + i][1]).toMatch('submarine');
      }
    });

    test('error when placed horizontally on x > 7', () => {
      expect(() => globalBoard.placeShip(destroyer, 8, 0)).toThrow(Error);
      expect(() => globalBoard.placeShip(submarine, 9, 9)).toThrow(Error);
    });

    test('error when placed vertically on y > 7', () => {
      expect(() => globalBoard.placeShip(destroyer, 6, 9, 'vertical')).toThrow(
        Error
      );
      expect(() => globalBoard.placeShip(submarine, 0, 8, 'vertical')).toThrow(
        Error
      );
    });
  });

  describe('patrol boat placement', () => {
    test('successfully placed horizontally on 0 <= x <= 8', () => {
      const board = Gameboard();
      board.placeShip(patrol, 7, 6);
      for (let i = 0; i < patrol.size; i += 1) {
        expect(board.getCells()[6][7 + i]).toMatch('patrol');
      }
    });

    test('successfully placed vertically on 0 <= y <= 8', () => {
      const board = Gameboard();
      board.placeShip(patrol, 0, 7, 'vertical');
      for (let i = 0; i < patrol.size; i += 1) {
        expect(board.getCells()[7 + i][0]).toMatch('patrol');
      }
    });

    test('error when placed horizontally on x > 8', () => {
      expect(() => globalBoard.placeShip(patrol, 9, 0)).toThrow(Error);
      expect(() => globalBoard.placeShip(patrol, 9, 9)).toThrow(Error);
    });

    test('error when placed vertically on y > 8', () => {
      expect(() => globalBoard.placeShip(patrol, 6, 9, 'vertical')).toThrow(
        Error
      );
      expect(() => globalBoard.placeShip(patrol, 0, 10, 'vertical')).toThrow(
        Error
      );
    });
  });

  test('placement on top of occupied cell', () => {
    const board = Gameboard();
    board.placeShip(carrier, 2, 5);
    expect(() => board.placeShip(battleship, 3, 3, 'vertical')).toThrow(Error);
    expect(() => board.placeShip(battleship, 7, 3, 'vertical')).not.toThrow(
      Error
    );
    expect(() => board.placeShip(patrol, 4, 6, 'vertical')).not.toThrow(Error);
    expect(() => board.placeShip(submarine, 2, 7)).toThrow(Error);
  });
});

describe('receiveAttack() & areAllShipsSunk method', () => {
  test('error when coord is out of bounds', () => {
    const board = Gameboard();
    expect(() => board.receiveAttack(10, -1)).toThrow('coords out of bounds');
  });

  test('attack on empty cell', () => {
    const board = Gameboard();
    board.receiveAttack(0, 1);
    expect(board.getCells()[1][0]).toBe(-1);
    board.receiveAttack(0, 1);
    expect(board.getCells()[1][0]).toBe(-1);
  });

  test('attack on occupied cell', () => {
    const board = Gameboard();
    const patrol = new Ship('patrol boat');
    board.placeShip(patrol, 0, 1);
    board.receiveAttack(0, 1);
    expect(board.getCells()[1][0]).toBe(1);
    expect(patrol.size).toBe(1);
    board.receiveAttack(0, 1);
    expect(board.getCells()[1][0]).toBe(1);
    expect(patrol.size).toBe(1);
  });

  test('finish off a ship or two', () => {
    const board = Gameboard();
    const patrol = new Ship('patrol boat');
    board.placeShip(patrol, 0, 1);
    board.receiveAttack(0, 1);
    expect(patrol.size).toBe(1);
    board.receiveAttack(1, 1);
    expect(patrol.size).toBe(0);
    expect(board.getShips().includes(patrol)).toBeFalsy();
    expect(board.areAllShipsSunk()).toBeTruthy();
    const patrol2 = new Ship('patrol boat');
    const carrier1 = new Ship('carrier');
    board.placeShip(patrol2, 3, 1, 'vertical');
    board.placeShip(carrier1, 4, 5);
    board.receiveAttack(3, 1);
    board.receiveAttack(3, 2);
    expect(patrol2.size).toBe(0);
    expect(board.getShips().includes(patrol2)).toBeFalsy();
    expect(board.getShips().length).toBe(1);
    expect(board.areAllShipsSunk()).toBeFalsy();
  });
});
