interface Number {
  getNthBit(position: number): 1 | 0;
  toHexString(): string;
  fromBytes(lowerByte: number, upperByte: number): number;
}
