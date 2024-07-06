Number.prototype.getNthBit = function (position: number): 1 | 0 {
  const value = ((this as number) >> position) & 1;
  return value as 1 | 0;
};

Number.prototype.toHexString = function (): string {
  return `0x${this.toString(16).padStart(4, "0")}`;
};

Number.prototype.fromBytes = function (
  lowerByte: number,
  upperByte: number
): number {
  if (!Number.isInteger(lowerByte) || lowerByte < 0 || lowerByte > 255) {
    throw new RangeError("Lower byte must be an integer between 0 and 255.");
  }

  if (!Number.isInteger(upperByte) || upperByte < 0 || upperByte > 255) {
    throw new RangeError("Upper byte must be an integer between 0 and 255.");
  }

  return (upperByte << 8) | lowerByte;
};
