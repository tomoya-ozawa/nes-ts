class Int {
  protected _value!: number;
  protected minValue: number;
  protected maxValue: number;

  constructor(value: number, minValue: number, maxValue: number) {
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.value = value; // 初期値を設定
  }

  // 値を設定する際に範囲チェックを行う
  public set value(value: number) {
    if (
      Number.isInteger(value) &&
      value >= this.minValue &&
      value <= this.maxValue
    ) {
      this._value = value;
    } else {
      throw new RangeError(
        `Value must be an integer between ${this.minValue} and ${this.maxValue}.`
      );
    }
  }

  // 値を取得する
  public get value(): number {
    return this._value;
  }

  // 加算メソッド
  public add(value: number): this {
    const result = this._value + value;
    return new (this.constructor as any)(
      ((result - this.minValue) % (this.maxValue - this.minValue + 1)) +
        this.minValue
    );
  }

  // 減算メソッド
  public subtract(value: number): this {
    const result = this._value - value;
    return new (this.constructor as any)(
      ((result - this.minValue) % (this.maxValue - this.minValue + 1)) +
        this.minValue
    );
  }

  // 表示用のtoStringメソッド
  public toString(): string {
    return this._value.toString();
  }
}

export class Uint8 extends Int {
  constructor(value: number = 0) {
    super(value, 0, 255);
  }
}

export class Int8 extends Int {
  constructor(value: number = 0) {
    super(value, -128, 127);
  }
}

export class Uint16 extends Int {
  constructor(value: number = 0) {
    super(value, 0, 65535);
  }

  // 下位バイトと上位バイトからUint16を作成する静的メソッド
  public static fromBytes(lowerByte: number, upperByte: number): Uint16 {
    if (!Number.isInteger(lowerByte) || lowerByte < 0 || lowerByte > 255) {
      throw new RangeError("Lower byte must be an integer between 0 and 255.");
    }
    if (!Number.isInteger(upperByte) || upperByte < 0 || upperByte > 255) {
      throw new RangeError("Upper byte must be an integer between 0 and 255.");
    }
    const combinedValue = (upperByte << 8) | lowerByte;
    return new Uint16(combinedValue);
  }
}
