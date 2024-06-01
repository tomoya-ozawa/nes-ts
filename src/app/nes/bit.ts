class Bit {
  public static isBit(value: unknown): value is Bit {
    return value instanceof Bit;
  }

  protected value: number;
  protected bitMask: number;

  constructor(value: number, bitMask: number) {
    this.bitMask = bitMask;
    this.value = value & this.bitMask;
  }

  public toNumber(): number {
    return this.value;
  }

  public setValue(value: number): void {
    this.value = value & this.bitMask;
  }

  public add(value: number | Bit): Bit {
    if (Bit.isBit(value)) {
      this.value = (this.value + value.toNumber()) & this.bitMask;
    } else {
      this.value = (this.value + value) & this.bitMask;
    }
    return this;
  }

  public inc(): Bit {
    this.add(1);
    return this;
  }

  public subtract(value: number): Bit {
    this.value = (this.value - value) & this.bitMask;
    return this;
  }

  public dec(): Bit {
    this.subtract(1);
    return this;
  }

  public toHexString(): string {
    return this.value.toString(16).padStart(this.bitMask === 0xff ? 2 : 4, "0");
  }

  public getSignedInt(): number {
    const maxUnsignedValue = this.bitMask;
    const maxSignedValue = maxUnsignedValue >> 1;
    if (this.value > maxSignedValue) {
      return this.value - maxUnsignedValue - 1;
    } else {
      return this.value;
    }
  }
}

export class Bit8 extends Bit {
  constructor(value: number = 0) {
    super(value, 0xff);
  }
}

export class Bit16 extends Bit {
  constructor(value: number = 0) {
    super(value, 0xffff);
  }

  // 下位バイトと上位バイトからUint16を作成する静的メソッド
  public static fromBytes(lowerByte: Bit8, upperByte: Bit8): Bit16 {
    const lowerVal = lowerByte.toNumber();
    if (!Number.isInteger(lowerVal) || lowerVal < 0 || lowerVal > 255) {
      throw new RangeError("Lower byte must be an integer between 0 and 255.");
    }
    const upperVal = upperByte.toNumber();
    if (!Number.isInteger(upperVal) || upperVal < 0 || upperVal > 255) {
      throw new RangeError("Upper byte must be an integer between 0 and 255.");
    }
    const combinedValue = (upperVal << 8) | lowerVal;
    return new Bit16(combinedValue);
  }
}
