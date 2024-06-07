export abstract class Bit {
  public static isBit(value: unknown): value is Bit {
    return value instanceof Bit;
  }

  protected readonly value: number;
  protected readonly bitMask: number;
  protected readonly bitSize: number;

  constructor(value: number, bitMask: number) {
    this.bitMask = bitMask;
    this.value = value & this.bitMask;
    this.bitSize = this.calculateBitSize(bitMask);
  }

  public toNumber(): number {
    return this.value;
  }

  // TODO: キャリーとoverflowの判定処理
  public add(value: number | Bit): this {
    const numValue = Bit.isBit(value) ? value.toNumber() : value;
    return this.createInstance((this.value + numValue) & this.bitMask);
  }

  public inc(): this {
    return this.add(1);
  }

  public subtract(value: number | Bit): this {
    const numValue = Bit.isBit(value) ? value.toNumber() : value;
    return this.createInstance((this.value - numValue) & this.bitMask);
  }

  public isMostSignificantBitSet(): boolean {
    const mostSignificantBit = 1 << (this.bitSize - 1);
    return (this.value & mostSignificantBit) !== 0;
  }

  public getNthBit(position: number): 1 | 0 {
    const value = (this.value >> position) & 1;
    return value as 1 | 0;
  }

  public dec(): this {
    return this.subtract(1);
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

  private calculateBitSize(mask: number): number {
    let size = 0;
    while (mask > 0) {
      mask >>= 1;
      size++;
    }
    return size;
  }

  private createInstance(value: number): this {
    const ctor: new (value: number) => this =
      Object.getPrototypeOf(this).constructor;
    return new ctor(value);
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
