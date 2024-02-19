import Player from './player';

export default function GameController(playerOne, playerTwo = null) {
  const p1 = playerOne;
  const p2 = playerTwo || new Player('Computer', 'red');
  let [attacker, target] = [p1, p2];

  let activeBoard = target.getBoard();

  function placeShip(
    player,
    shipType,
    x,
    y,
    axis = 'horizontal',
    random = false
  ) {
    return player.placeShip(shipType, x, y, axis, random);
  }

  function switchAttackerTarget() {
    [attacker, target] = [target, attacker];
    activeBoard = target.getBoard();
  }

  function placeAttack(x, y, random = false) {
    const attack = attacker.placeAttack(target.getBoard(), x, y, random);
    if (target.getBoard().allShipsAreSunk()) {
      return { code: 0 };
    }
    switchAttackerTarget();
    const code =
      attacker.getBoard().getCells()[attack.y][attack.x] === 1 ? 1 : -1;
    return { code, x: attack.x, y: attack.y };
  }

  return {
    getActiveBoard: () => activeBoard,
    getAttackerTarget: () => [attacker, target],
    placeShip,
    placeAttack,
  };
}
