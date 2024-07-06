import { Bit16, Bit8 } from "./bit";

export default class RAM {
  ram: { [key: number]: Bit8 | undefined } = {};

  get(key: number | Bit8 | Bit16): Bit8 {
    const address = Bit16.isBit(key) ? key.toNumber() : key;
    const data = this.ram[address];
    return data ? data : new Bit8();
  }

  getAll(): Bit8[] {
    return Object.keys(this.ram).map((key) => this.get(Number(key)));
  }

  set(key: number | Bit8 | Bit16, value: Bit8): void {
    const address = Bit16.isBit(key) ? key.toNumber() : key;
    this.ram[address] = value;
  }
}
