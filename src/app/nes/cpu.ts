import { Int8, Uint16, Uint8 } from "./Int";
import { Bus } from "./nes";
import OPCODES, { Opcode } from "./opcodes";

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

  // d,x	Zero page indexed	val = PEEK((arg + X) % 256)	4
  // d,y	Zero page indexed	val = PEEK((arg + Y) % 256)	4
  // a,x	Absolute indexed	val = PEEK(arg + X)	4+
  // a,y	Absolute indexed	val = PEEK(arg + Y)	4+
  // (d,x)	Indexed indirect	val = PEEK(PEEK((arg + X) % 256) + PEEK((arg + X + 1) % 256) * 256)	6
  // (d),y	Indirect indexed	val = PEEK(PEEK(arg) + PEEK((arg + 1) % 256) * 256 + Y)	5+

  private getValue(mode: Opcode["addressingMode"]): number {
    switch (mode) {
      case "implied":
        return 0;
      case "accumulator":
        return this.registers.a;
      case "immediate":
      case "zeropage":
        return this.fetch();
      case "zeropageX":
      case "zeropageY": {
        const register =
          mode === "zeropageX" ? this.registers.x : this.registers.y;
        const uint8 = new Uint8(this.fetch());
        const addedValue = uint8.add(register);
        return addedValue.value;
      }
      case "relative": {
        const relativeVal = new Int8(this.fetch());
        return this.registers.pc + relativeVal.value;
      }
      case "indirect":
      case "indirectX":
      case "indirectY":
      case "absolute": {
        const uint16 = Uint16.fromBytes(this.fetch(), this.fetch());
        return uint16.value;
      }
      case "absoluteX":
      case "absoluteY": {
        const register =
          mode === "absoluteX" ? this.registers.x : this.registers.y;
        const uint16 = Uint16.fromBytes(this.fetch(), this.fetch());
        const absX = uint16.value + register;
        return absX;
      }
    }
  }
}
