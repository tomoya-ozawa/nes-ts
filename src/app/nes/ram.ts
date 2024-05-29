import Uint8 from "./Uint8";

export default class RAM {
  ram: { [key: number]: Uint8 } = {};

  get(key: number): Uint8 {
    return this.ram[key];
  }

  set(key: number, value: Uint8): void {
    this.ram[key] = value;
  }
}
