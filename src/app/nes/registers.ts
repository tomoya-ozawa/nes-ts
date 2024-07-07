import NumUtils from "./NumUtils";

export class Bit8Register {
  constructor(private value: number) {}

  get(): number {
    return this.value;
  }

  set(value: number): void {
    if (value < 0x00 || value > 0xff) {
      throw new Error(`invalid value: ${NumUtils.toHexString(value)}`);
    }

    this.value = value;
  }
}

export class Bit16Register {
  constructor(private value: number) {}

  get(): number {
    return this.value;
  }

  set(value: number): void {
    if (value < 0x00 || value > 0xffff) {
      throw new Error(`invalid value: ${NumUtils.toHexString(value)}`);
    }

    this.value = value;
  }
}
// 7	N	ネガティブ	Aの7ビット目と同じになります。負数の判定用。
// 6	V	オーバーフロー	演算がオーバーフローを起こした場合セットされます。
// 5	R	予約済み	使用できません。常にセットされています。
// 4	B	ブレークモード	BRK発生時はセットされ、IRQ発生時はクリアされます。
// 3	D	デシマルモード	セットすると、BCDモードで動作します。(ファミコンでは未実装)
// 2	I	IRQ禁止	クリアするとIRQが許可され、セットするとIRQが禁止になります。
// 1	Z	ゼロ	演算結果が0になった場合セットされます。ロード命令でも変化します。
// 0	C	キャリー	キャリー発生時セットされます。
export class StatusRegister {
  constructor(private value: number) {}

  get n(): 1 | 0 {
    return NumUtils.getNthBit(this.value, 7);
  }

  set n(value: 1 | 0) {
    if (value === 1) {
      this.value = this.value | 0b10000000;
    } else {
      this.value = this.value & 0b01111111;
    }
  }

  get v(): 1 | 0 {
    return NumUtils.getNthBit(this.value, 6);
  }

  set v(value: 1 | 0) {
    if (value === 1) {
      this.value = this.value | 0b01000000;
    } else {
      this.value = this.value & 0b10111111;
    }
  }

  get r(): 1 {
    return 1;
  }

  get b(): 1 | 0 {
    return NumUtils.getNthBit(this.value, 4);
  }

  set b(value: 1 | 0) {
    if (value === 1) {
      this.value = this.value | 0b00010000;
    } else {
      this.value = this.value & 0b11101111;
    }
  }

  get d(): 1 | 0 {
    return NumUtils.getNthBit(this.value, 3);
  }

  set d(value: 1 | 0) {
    if (value === 1) {
      this.value = this.value | 0b00001000;
    } else {
      this.value = this.value & 0b11110111;
    }
  }

  get i(): 1 | 0 {
    return NumUtils.getNthBit(this.value, 2);
  }

  set i(value: 1 | 0) {
    if (value === 1) {
      this.value = this.value | 0b00000100;
    } else {
      this.value = this.value & 0b11111011;
    }
  }

  get z(): 1 | 0 {
    return NumUtils.getNthBit(this.value, 1);
  }

  set z(value: 1 | 0) {
    if (value === 1) {
      this.value = this.value | 0b00000010;
    } else {
      this.value = this.value & 0b11111101;
    }
  }

  get c(): 1 | 0 {
    return NumUtils.getNthBit(this.value, 0);
  }

  set c(value: 1 | 0) {
    if (value === 1) {
      this.value = this.value | 0b00000001;
    } else {
      this.value = this.value & 0b11111110;
    }
  }

  get(): number {
    return this.value;
  }
  set(value: number): void {
    if (value < 0x00 || value > 0xff) {
      throw new Error(`invalid value: ${NumUtils.toHexString(value)}`);
    }

    this.value = value | 0b00100000;
  }
}
