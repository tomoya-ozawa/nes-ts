import NumUtils from "./NumUtils";

export default class RAM {
  ram: { [key: number]: number | undefined } = {};

  get(key: number): number {
    const data = this.ram[key];
    return data ? data : 0;
  }

  getAll(): number[] {
    return Object.keys(this.ram).map((key) => this.get(Number(key)));
  }

  set(key: number, value: number): void {
    if (value < 0x00 || value > 0xff) {
      throw new Error(`invalid value: ${NumUtils.toHexString(value)}`);
    }

    this.ram[key] = value;
  }
}
