export default class Ship {
  constructor(type) {
    const types = [
      'carrier',
      'battleship',
      'destroyer',
      'submarine',
      'patrol boat',
    ];
    if (!types.includes(type))
      throw new Error(`invalid type of ship. Please choose between ${types}`);
    this.type = type;
    if (this.type === types[0]) {
      this.size = 5;
    } else if (this.type === types[1]) {
      this.size = 4;
    } else if (this.type === types[2] || this.type === types[3]) {
      this.size = 3;
    } else if (this.type === types[4]) {
      this.size = 2;
    }
  }

  hit() {
    this.size -= this.size > 0 ? 1 : 0;
    return this;
  }

  isSunk() {
    return this.size === 0;
  }
}
