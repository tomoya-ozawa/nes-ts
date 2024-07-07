const getNthBit = (value: number, position: number): 1 | 0 => {
  return ((value >> position) & 1) as 1 | 0;
};

const to8Bit = (value: number): number => {
  return value & 0xff;
};

const to16Bit = (value: number): number => {
  return value & 0xffff;
};

const toHexString = (value: number): string => {
  return `0x${value.toString(16).padStart(4, "0")}`;
};

const fromBytes = function (lowerByte: number, upperByte: number): number {
  if (!Number.isInteger(lowerByte) || lowerByte < 0 || lowerByte > 255) {
    throw new RangeError("Lower byte must be an integer between 0 and 255.");
  }

  if (!Number.isInteger(upperByte) || upperByte < 0 || upperByte > 255) {
    throw new RangeError("Upper byte must be an integer between 0 and 255.");
  }

  return (upperByte << 8) | lowerByte;
};

const NumUtils = {
  getNthBit,
  to8Bit,
  to16Bit,
  toHexString,
  fromBytes,
};

export default NumUtils;
