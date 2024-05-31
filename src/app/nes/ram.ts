import { Bit16, Bit8 } from "./bit";

export default class RAM {
  ram: { [key: number]: Bit8 } = {};

  get(key: number): Bit8 {
    return this.ram[key];
  }

  set(key: number, value: Bit8): void {
    this.ram[key] = value;
  }
}
