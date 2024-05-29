export default class Uint8 {
  private _value: number = 0;

  constructor(value: number = 0) {
    this.value = value; // 初期値を設定
  }

  // 値を設定する際に範囲チェックを行う
  public set value(value: number) {
    if (Number.isInteger(value) && value >= 0 && value <= 255) {
      this._value = value;
    } else {
      throw new RangeError("Value must be an integer between 0 and 255.");
    }
  }

  // 値を取得する
  public get value(): number {
    return this._value;
  }

  // 加算メソッド
  public add(value: number): Uint8 {
    return new Uint8((this._value + value) % 256);
  }

  // 減算メソッド
  public subtract(value: number): Uint8 {
    return new Uint8((this._value - value + 256) % 256);
  }

  // ビット演算（例：AND）
  public and(value: number): Uint8 {
    return new Uint8(this._value & value);
  }

  // ビット演算（例：OR）
  public or(value: number): Uint8 {
    return new Uint8(this._value | value);
  }

  // ビット演算（例：XOR）
  public xor(value: number): Uint8 {
    return new Uint8(this._value ^ value);
  }

  // ビットシフト（例：左シフト）
  public shiftLeft(bits: number): Uint8 {
    return new Uint8((this._value << bits) % 256);
  }

  // ビットシフト（例：右シフト）
  public shiftRight(bits: number): Uint8 {
    return new Uint8(this._value >> bits);
  }

  // 表示用のtoStringメソッド
  public toString(): string {
    return this._value.toString();
  }
}
