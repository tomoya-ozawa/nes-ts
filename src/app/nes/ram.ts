import { Bit16, Bit8 } from "./bit";

export default class RAM {
  ram: { [key: number]: Bit8 } = {};

  get(key: number | Bit8 | Bit16): Bit8 {
    const address = Bit16.isBit(key) ? key.toNumber() : key;
    return this.ram[address];
  }

  set(key: number | Bit8 | Bit16, value: Bit8): void {
    const address = Bit16.isBit(key) ? key.toNumber() : key;
    this.ram[address] = value;
  }
}
