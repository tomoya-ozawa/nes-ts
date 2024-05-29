import { Bus } from "./nes";
import OPCODES from "./opcodes";

type Registers = {
  a: number;
  x: number;
  y: number;
  pc: number;
  stackPointer: number;
  status: number;
};

export default class CPU {
  registers: Registers = {
    a: 0,
    x: 0,
    y: 0,
    pc: 0x10,
    stackPointer: 0,
    status: 0,
  };

  public constructor(private bus: Bus) {}

  public fetch() {
    this.registers.pc++;
    return this.bus.rom[this.registers.pc];
  }

  public execute(opcode: keyof typeof OPCODES) {
    const { mnemonics, addressingMode } = OPCODES[opcode];

    switch (true) {
      case mnemonics.includes("LDX"):
        this.registers.x = this.getValue(addressingMode);
      case mnemonics.includes("ISC"):
        const address = this.getValue(addressingMode);
        const value = this.bus.ram.get(address);
        this.bus.ram.set(address, value.add(1));
    }

    this.registers.pc = this.registers.pc++;
  }

  public getCounter() {
    return this.registers.pc;
  }

  private getValue(mode: string): number {
    switch (mode) {
      case "immediate":
        return this.fetch();
      case "absoluteX":
        const lower = this.fetch();
        const higher = this.fetch();
        const absoluteAddress = parseInt(
          `${higher.toString(16)}${lower.toString(16)}`,
          16
        );
        const absX = absoluteAddress + this.registers.pc;
        return absX;
    }

    throw Error("no value!");
  }
}
