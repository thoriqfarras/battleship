/* eslint-disable no-undef */
import Ship from '../src/ship';

test('invalid/empty type throws error', () => {
  expect(() => new Ship()).toThrow(Error);
  expect(() => new Ship('cruise')).toThrow(Error);
});

test('hit() reduces size by 1', () => {
  expect(new Ship('carrier').hit().size).toBe(4);
});

test('carrier sunk when hit 5 times or more', () => {
  expect(
    new Ship('carrier').hit().hit().hit().hit().hit().isSunk()
  ).toBeTruthy();
  expect(
    new Ship('carrier').hit().hit().hit().hit().hit().hit().hit().isSunk()
  ).toBeTruthy();
});

test('battleship sunk when hit 4 times or more', () => {
  expect(new Ship('battleship').hit().hit().hit().hit().isSunk()).toBeTruthy();
  expect(
    new Ship('battleship').hit().hit().hit().hit().hit().hit().hit().isSunk()
  ).toBeTruthy();
});

test('destroyer sunk when hit 3 times or more', () => {
  expect(new Ship('destroyer').hit().hit().hit().isSunk()).toBeTruthy();
  expect(
    new Ship('destroyer').hit().hit().hit().hit().hit().hit().hit().isSunk()
  ).toBeTruthy();
});

test('submarine sunk when hit 3 times or more', () => {
  expect(new Ship('submarine').hit().hit().hit().isSunk()).toBeTruthy();
  expect(
    new Ship('submarine').hit().hit().hit().hit().hit().hit().hit().isSunk()
  ).toBeTruthy();
});

test('patrol boat sunk when hit 2 times or more', () => {
  expect(new Ship('patrol boat').hit().hit().isSunk()).toBeTruthy();
  expect(
    new Ship('patrol boat').hit().hit().hit().hit().hit().hit().hit().isSunk()
  ).toBeTruthy();
});
