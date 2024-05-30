import { Uint8 } from "./Int";

export default class RAM {
  ram: { [key: number]: Uint8 } = {};

  get(key: number): Uint8 {
    return this.ram[key];
  }

  set(key: number, value: Uint8): void {
    this.ram[key] = value;
  }
}
