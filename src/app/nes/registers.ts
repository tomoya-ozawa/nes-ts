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
