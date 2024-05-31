import { Bit8, Bit16 } from "./bit";
import { Bus } from "./nes";
import OPCODES, { Opcode } from "./opcodes";

type Registers = {
  a: Bit8;
  x: Bit8;
  y: Bit8;
  pc: Bit16;
  stackPointer: Bit8;
  status: {
    // 7	N	ネガティブ	Aの7ビット目と同じになります。負数の判定用。
    n: 1 | 0;
    // 6	V	オーバーフロー	演算がオーバーフローを起こした場合セットされます。
    v: 1 | 0;
    // 5	R	予約済み	使用できません。常にセットされています。
    r: 1;
    // 4	B	ブレークモード	BRK発生時はセットされ、IRQ発生時はクリアされます。
    b: 1 | 0;
    // 3	D	デシマルモード	セットすると、BCDモードで動作します。(ファミコンでは未実装)
    d: 1 | 0;
    // 2	I	IRQ禁止	クリアするとIRQが許可され、セットするとIRQが禁止になります。
    i: 1 | 0;
    // 1	Z	ゼロ	演算結果が0になった場合セットされます。ロード命令でも変化します。
    z: 1 | 0;
    // 0	C	キャリー	キャリー発生時セットされます。
    c: 1 | 0;
  };
};

export default class CPU {
  registers: Registers = {
    a: new Bit8(0),
    x: new Bit8(0),
    y: new Bit8(0),
    pc: new Bit16(0x10),
    stackPointer: new Bit8(0),
    status: {
      n: 0,
      v: 0,
      r: 1,
      b: 0,
      d: 0,
      i: 0,
      z: 0,
      c: 0,
    },
  };

  public constructor(private bus: Bus) {}

  public fetch(): Bit8 {
    this.registers.pc.inc();
    return new Bit8(this.bus.rom[this.registers.pc.getValue()]);
  }

  public execute() {
    const opcode = this.fetch().getValue();
    const { mnemonics, addressingMode } = OPCODES[opcode];

    switch (true) {
      case mnemonics.includes("INS"):
        this.registers.status.i = 1;
        break;
      case mnemonics.includes("SEI"):
        this.registers.status.i = 1;
        break;
      case mnemonics.includes("BRK"):
        break;
      case mnemonics.includes("TXS"):
        this.registers.stackPointer = this.registers.x;
        break;
      case mnemonics.includes("LDA"):
        this.registers.a = new Bit8(this.getValue(addressingMode));
        break;
      case mnemonics.includes("LDX"):
        this.registers.x = new Bit8(this.getValue(addressingMode));
        break;
      case mnemonics.includes("LDY"):
        this.registers.y = new Bit8(this.getValue(addressingMode));
        break;
      case mnemonics.includes("STA"):
        this.bus.ram.set(this.getValue(addressingMode), this.registers.a);
        break;
      case mnemonics.includes("INX"): {
        this.registers.x.inc();
        break;
      }
      case mnemonics.includes("ISC"): {
        const address = this.getValue(addressingMode);
        const value = this.bus.ram.get(address);
        value.add(1);
        this.bus.ram.set(address, value);
        break;
      }
      case mnemonics.includes("DEY"): {
        this.registers.y.dec();
        break;
      }
      case mnemonics.includes("BNE"): {
        const relative = new Bit8(this.getValue(addressingMode)).getSignedInt();
        if (this.registers.status.z === 0) {
          this.registers.pc.add(relative);
        }
        break;
      }
      case mnemonics.includes("JSR"): {
        const address = this.getValue(addressingMode);
        this.registers.pc = new Bit16(address);
        break;
      }
      default:
        throw new Error(
          `invalid opcode! ${opcode.toString(
            16
          )} , ${this.registers.pc.toHexString()}`
        );
    }
  }

  public getCounter(): number {
    return this.registers.pc.getValue();
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
        return this.registers.a.getValue();
      case "immediate":
      case "zeropage":
        return this.fetch().getValue();
      case "zeropageX":
      case "zeropageY": {
        const register =
          mode === "zeropageX" ? this.registers.x : this.registers.y;
        const bit8 = this.fetch();
        bit8.add(register);
        return bit8.getValue();
      }
      case "relative": {
        const signedInt = this.fetch().getSignedInt();
        this.registers.pc.add(signedInt);
        return this.registers.pc.getValue();
      }
      case "indirect":
      case "indirectX":
      case "indirectY":
      case "absolute": {
        const bit16 = Bit16.fromBytes(this.fetch(), this.fetch());
        return bit16.getValue();
      }
      case "absoluteX":
      case "absoluteY": {
        const register =
          mode === "absoluteX" ? this.registers.x : this.registers.y;
        const bit16 = Bit16.fromBytes(this.fetch(), this.fetch());
        bit16.add(register);
        return bit16.getValue();
      }
    }
  }
}
