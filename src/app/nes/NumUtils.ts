export const getNthBit = function (value: number, position: number): 1 | 0 {
  return ((value >> position) & 1) as 1 | 0;
};

export const toHexString = (value: number): string => {
  return `0x${value.toString(16).padStart(4, "0")}`;
};

export const fromBytes = function (
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
