import { Bit8, Bit16 } from "./bit";

export class Bit8Register {
  constructor(private value: Bit8) {}

  get(): Bit8 {
    return this.value;
  }

  set(value: Bit8 | Bit16): void {
    this.value = new Bit8(value.toNumber());
  }
}

export class Bit16Register {
  constructor(private value: Bit16) {}

  get(): Bit16 {
    return this.value;
  }

  set(value: Bit8 | Bit16): void {
    this.value = new Bit16(value.toNumber());
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
  constructor(private value: Bit8) {}

  get n(): 1 | 0 {
    return this.value.getNthBit(7);
  }

  set n(value: 1 | 0) {
    if (value === 1) {
      this.value = new Bit8(this.value.toNumber() | 0b10000000);
    } else {
      this.value = new Bit8(this.value.toNumber() & 0b01111111);
    }
  }

  get v(): 1 | 0 {
    return this.value.getNthBit(6);
  }

  set v(value: 1 | 0) {
    if (value === 1) {
      this.value = new Bit8(this.value.toNumber() | 0b01000000);
    } else {
      this.value = new Bit8(this.value.toNumber() & 0b10111111);
    }
  }

  get r(): 1 | 0 {
    return 1; //this.value.getNthBit(5);
  }

  get b(): 1 | 0 {
    return this.value.getNthBit(4);
  }

  set b(value: 1 | 0) {
    if (value === 1) {
      this.value = new Bit8(this.value.toNumber() | 0b00010000);
    } else {
      this.value = new Bit8(this.value.toNumber() & 0b11101111);
    }
  }

  get d(): 1 | 0 {
    return this.value.getNthBit(3);
  }

  set d(value: 1 | 0) {
    if (value === 1) {
      this.value = new Bit8(this.value.toNumber() | 0b00001000);
    } else {
      this.value = new Bit8(this.value.toNumber() & 0b11110111);
    }
  }

  get i(): 1 | 0 {
    return this.value.getNthBit(2);
  }

  set i(value: 1 | 0) {
    if (value === 1) {
      this.value = new Bit8(this.value.toNumber() | 0b00000100);
    } else {
      this.value = new Bit8(this.value.toNumber() & 0b11111011);
    }
  }

  get z(): 1 | 0 {
    return this.value.getNthBit(1);
  }

  set z(value: 1 | 0) {
    if (value === 1) {
      this.value = new Bit8(this.value.toNumber() | 0b00000010);
    } else {
      this.value = new Bit8(this.value.toNumber() & 0b11111101);
    }
  }

  get c(): 1 | 0 {
    return this.value.getNthBit(0);
  }

  set c(value: 1 | 0) {
    if (value === 1) {
      this.value = new Bit8(this.value.toNumber() | 0b00000001);
    } else {
      this.value = new Bit8(this.value.toNumber() & 0b11111110);
    }
  }

  get(): Bit8 {
    return new Bit8(this.value.toNumber());
  }

  set(value: Bit8 | Bit16): void {
    // rは必ずセットされる
    this.value = new Bit8(value.toNumber() | 0b00100000);
  }
}
