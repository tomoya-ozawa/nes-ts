import { TestLogger } from "./TestLogger";
import { CpuBus } from "./nes";
import OPCODES, { Opcode } from "./opcodes";
import { Bit16Register, Bit8Register, StatusRegister } from "./registers";
import NumUtils from "./NumUtils";

type Registers = {
  a: Bit8Register;
  x: Bit8Register;
  y: Bit8Register;
  pc: Bit16Register;
  stackPointer: Bit8Register;
  s: StatusRegister;
};

export default class CPU {
  registers: Registers = {
    a: new Bit8Register(0),
    x: new Bit8Register(0),
    y: new Bit8Register(0),
    pc: new Bit16Register(0xc000),
    stackPointer: new Bit8Register(0xfd),
    s: new StatusRegister(0x24),
  };

  public constructor(private bus: CpuBus, private logger: TestLogger) {}

  public reset() {
    const lower = this.bus.read(0xfffc);
    const upper = this.bus.read(0xfffd);
    const counter = NumUtils.fromBytes(lower, upper);
    this.registers.pc.set(counter);
  }

  public nmi() {
    const returnAddress = this.registers.pc.get();
    const returnAddressUpper = returnAddress >> 8;
    const returnAddressLower = returnAddress & 0xff;

    this.pushToStack(returnAddressUpper);
    this.pushToStack(returnAddressLower);
    this.pushToStack(this.registers.s.get());

    const lower = this.bus.read(0xfffa);
    const upper = this.bus.read(0xfffb);
    const counter = NumUtils.fromBytes(lower, upper);
    this.registers.pc.set(counter);
  }

  public fetch(): number {
    const op = this.bus.read(this.registers.pc.get());
    this.logger.pushOpCode(op);
    this.registers.pc.set(this.registers.pc.get() + 1);
    return op;
  }

  public execute() {
    this.logger.push(this.registers.pc.get());
    const opcode = this.fetch();
    this.logger.push(OPCODES[opcode].mnemonics[0]);
    this.logger.push(
      `A:${this.registers.a.get().toString(16).padStart(2, "0").toUpperCase()}`
    );
    this.logger.push(
      `X:${this.registers.x.get().toString(16).padStart(2, "0").toUpperCase()}`
    );
    this.logger.push(
      `Y:${this.registers.y.get().toString(16).padStart(2, "0").toUpperCase()}`
    );
    this.logger.push(
      `P:${this.registers.s.get().toString(16).padStart(2, "0").toUpperCase()}`
    );
    this.logger.push(
      `SP:${this.registers.stackPointer
        .get()
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()}`
    );

    switch (opcode) {
      case 0x00:
        return this.brk(0x0, "implied");
      case 0x01:
        return this.ora(0x1, "indirectX");
      case 0x03:
        return this.illegal(0x3);
      case 0x04:
        return this.illegal(0x4);
      case 0x05:
        return this.ora(0x5, "zeropage");
      case 0x06:
        return this.asl(0x6, "zeropage");
      case 0x07:
        return this.illegal(0x7);
      case 0x08:
        return this.php(0x8, "implied");
      case 0x09:
        return this.ora(0x9, "immediate");
      case 0x0a:
        return this.asl(0xa, "accumulator");
      case 0x0b:
        return this.illegal(0xb);
      case 0x0c:
        return this.illegal(0xc);
      case 0x0d:
        return this.ora(0xd, "absolute");
      case 0x0e:
        return this.asl(0xe, "absolute");
      case 0x0f:
        return this.illegal(0xf);
      case 0x10:
        return this.bpl(0x10, "relative");
      case 0x11:
        return this.ora(0x11, "indirectY");
      case 0x13:
        return this.illegal(0x13);
      case 0x14:
        return this.illegal(0x14);
      case 0x15:
        return this.ora(0x15, "zeropageX");
      case 0x16:
        return this.asl(0x16, "zeropageX");
      case 0x17:
        return this.illegal(0x17);
      case 0x18:
        return this.clc(0x18, "implied");
      case 0x19:
        return this.ora(0x19, "absoluteY");
      case 0x1a:
        return this.illegal(0x1a);
      case 0x1b:
        return this.illegal(0x1b);
      case 0x1c:
        return this.illegal(0x1c);
      case 0x1d:
        return this.ora(0x1d, "absoluteX");
      case 0x1e:
        return this.asl(0x1e, "absoluteX");
      case 0x1f:
        return this.illegal(0x1f);
      case 0x20:
        return this.jsr(0x20, "absolute");
      case 0x21:
        return this.and(0x21, "indirectX");
      case 0x23:
        return this.illegal(0x23);
      case 0x24:
        return this.bit(0x24, "zeropage");
      case 0x25:
        return this.and(0x25, "zeropage");
      case 0x26:
        return this.rol(0x26, "zeropage");
      case 0x27:
        return this.illegal(0x27);
      case 0x28:
        return this.plp(0x28, "implied");
      case 0x29:
        return this.and(0x29, "immediate");
      case 0x2a:
        return this.rol(0x2a, "accumulator");
      case 0x2b:
        return this.illegal(0x2b);
      case 0x2c:
        return this.bit(0x2c, "absolute");
      case 0x2d:
        return this.and(0x2d, "absolute");
      case 0x2e:
        return this.rol(0x2e, "absolute");
      case 0x2f:
        return this.illegal(0x2f);
      case 0x30:
        return this.bmi(0x30, "relative");
      case 0x31:
        return this.and(0x31, "indirectY");
      case 0x33:
        return this.illegal(0x33);
      case 0x34:
        return this.illegal(0x34);
      case 0x35:
        return this.and(0x35, "zeropageX");
      case 0x36:
        return this.rol(0x36, "zeropageX");
      case 0x37:
        return this.illegal(0x37);
      case 0x38:
        return this.sec(0x38, "implied");
      case 0x39:
        return this.and(0x39, "absoluteY");
      case 0x3a:
        return this.illegal(0x3a);
      case 0x3b:
        return this.illegal(0x3b);
      case 0x3c:
        return this.illegal(0x3c);
      case 0x3d:
        return this.and(0x3d, "absoluteX");
      case 0x3e:
        return this.rol(0x3e, "absoluteX");
      case 0x3f:
        return this.illegal(0x3f);
      case 0x40:
        return this.rti(0x40, "implied");
      case 0x41:
        return this.eor(0x41, "indirectX");
      case 0x43:
        return this.illegal(0x43);
      case 0x44:
        return this.illegal(0x44);
      case 0x45:
        return this.eor(0x45, "zeropage");
      case 0x46:
        return this.lsr(0x46, "zeropage");
      case 0x47:
        return this.illegal(0x47);
      case 0x48:
        return this.pha(0x48, "implied");
      case 0x49:
        return this.eor(0x49, "immediate");
      case 0x4a:
        return this.lsr(0x4a, "accumulator");
      case 0x4b:
        return this.illegal(0x4b);
      case 0x4c:
        return this.jmp(0x4c, "absolute");
      case 0x4d:
        return this.eor(0x4d, "absolute");
      case 0x4e:
        return this.lsr(0x4e, "absolute");
      case 0x4f:
        return this.illegal(0x4f);
      case 0x50:
        return this.bvc(0x50, "relative");
      case 0x51:
        return this.eor(0x51, "indirectY");
      case 0x53:
        return this.illegal(0x53);
      case 0x54:
        return this.illegal(0x54);
      case 0x55:
        return this.eor(0x55, "zeropageX");
      case 0x56:
        return this.lsr(0x56, "zeropageX");
      case 0x57:
        return this.illegal(0x57);
      case 0x58:
        return this.cli(0x58, "implied");
      case 0x59:
        return this.eor(0x59, "absoluteY");
      case 0x5a:
        return this.illegal(0x5a);
      case 0x5b:
        return this.illegal(0x5b);
      case 0x5c:
        return this.illegal(0x5c);
      case 0x5d:
        return this.eor(0x5d, "absoluteX");
      case 0x5e:
        return this.lsr(0x5e, "absoluteX");
      case 0x5f:
        return this.illegal(0x5f);
      case 0x60:
        return this.rts(0x60, "implied");
      case 0x61:
        return this.adc(0x61, "indirectX");
      case 0x63:
        return this.illegal(0x63);
      case 0x64:
        return this.illegal(0x64);
      case 0x65:
        return this.adc(0x65, "zeropage");
      case 0x66:
        return this.ror(0x66, "zeropage");
      case 0x67:
        return this.illegal(0x67);
      case 0x68:
        return this.pla(0x68, "implied");
      case 0x69:
        return this.adc(0x69, "immediate");
      case 0x6a:
        return this.ror(0x6a, "accumulator");
      case 0x6b:
        return this.illegal(0x6b);
      case 0x6c:
        return this.jmp(0x6c, "indirect");
      case 0x6d:
        return this.adc(0x6d, "absolute");
      case 0x6e:
        return this.ror(0x6e, "absolute");
      case 0x6f:
        return this.illegal(0x6f);
      case 0x70:
        return this.bvs(0x70, "relative");
      case 0x71:
        return this.adc(0x71, "indirectY");
      case 0x73:
        return this.illegal(0x73);
      case 0x74:
        return this.illegal(0x74);
      case 0x75:
        return this.adc(0x75, "zeropageX");
      case 0x76:
        return this.ror(0x76, "zeropageX");
      case 0x77:
        return this.illegal(0x77);
      case 0x78:
        return this.sei(0x78, "implied");
      case 0x79:
        return this.adc(0x79, "absoluteY");
      case 0x7a:
        return this.illegal(0x7a);
      case 0x7b:
        return this.illegal(0x7b);
      case 0x7c:
        return this.illegal(0x7c);
      case 0x7d:
        return this.adc(0x7d, "absoluteX");
      case 0x7e:
        return this.ror(0x7e, "absoluteX");
      case 0x7f:
        return this.illegal(0x7f);
      case 0x80:
        return this.illegal(0x80);
      case 0x81:
        return this.sta(0x81, "indirectX");
      case 0x82:
        return this.illegal(0x82);
      case 0x83:
        return this.illegal(0x83);
      case 0x84:
        return this.sty(0x84, "zeropage");
      case 0x85:
        return this.sta(0x85, "zeropage");
      case 0x86:
        return this.stx(0x86, "zeropage");
      case 0x87:
        return this.illegal(0x87);
      case 0x88:
        return this.dey(0x88, "implied");
      case 0x89:
        return this.illegal(0x89);
      case 0x8a:
        return this.txa(0x8a, "implied");
      case 0x8b:
        return this.illegal(0x8b);
      case 0x8c:
        return this.sty(0x8c, "absolute");
      case 0x8d:
        return this.sta(0x8d, "absolute");
      case 0x8e:
        return this.stx(0x8e, "absolute");
      case 0x8f:
        return this.illegal(0x8f);
      case 0x90:
        return this.bcc(0x90, "relative");
      case 0x91:
        return this.sta(0x91, "indirectY");
      case 0x93:
        return this.illegal(0x93);
      case 0x94:
        return this.sty(0x94, "zeropageX");
      case 0x95:
        return this.sta(0x95, "zeropageX");
      case 0x96:
        return this.stx(0x96, "zeropageY");
      case 0x97:
        return this.illegal(0x97);
      case 0x98:
        return this.tya(0x98, "implied");
      case 0x99:
        return this.sta(0x99, "absoluteY");
      case 0x9a:
        return this.txs(0x9a, "implied");
      case 0x9b:
        return this.illegal(0x9b);
      case 0x9c:
        return this.illegal(0x9c);
      case 0x9d:
        return this.sta(0x9d, "absoluteX");
      case 0x9e:
        return this.illegal(0x9e);
      case 0x9f:
        return this.illegal(0x9f);
      case 0xa0:
        return this.ldy(0xa0, "immediate");
      case 0xa1:
        return this.lda(0xa1, "indirectX");
      case 0xa2:
        return this.ldx(0xa2, "immediate");
      case 0xa3:
        return this.illegal(0xa3);
      case 0xa4:
        return this.ldy(0xa4, "zeropage");
      case 0xa5:
        return this.lda(0xa5, "zeropage");
      case 0xa6:
        return this.ldx(0xa6, "zeropage");
      case 0xa7:
        return this.illegal(0xa7);
      case 0xa8:
        return this.tay(0xa8, "implied");
      case 0xa9:
        return this.lda(0xa9, "immediate");
      case 0xaa:
        return this.tax(0xaa, "implied");
      case 0xab:
        return this.illegal(0xab);
      case 0xac:
        return this.ldy(0xac, "absolute");
      case 0xad:
        return this.lda(0xad, "absolute");
      case 0xae:
        return this.ldx(0xae, "absolute");
      case 0xaf:
        return this.illegal(0xaf);
      case 0xb0:
        return this.bcs(0xb0, "relative");
      case 0xb1:
        return this.lda(0xb1, "indirectY");
      case 0xb3:
        return this.illegal(0xb3);
      case 0xb4:
        return this.ldy(0xb4, "zeropageX");
      case 0xb5:
        return this.lda(0xb5, "zeropageX");
      case 0xb6:
        return this.ldx(0xb6, "zeropageY");
      case 0xb7:
        return this.illegal(0xb7);
      case 0xb8:
        return this.clv(0xb8, "implied");
      case 0xb9:
        return this.lda(0xb9, "absoluteY");
      case 0xba:
        return this.tsx(0xba, "implied");
      case 0xbb:
        return this.illegal(0xbb);
      case 0xbc:
        return this.ldy(0xbc, "absoluteX");
      case 0xbd:
        return this.lda(0xbd, "absoluteX");
      case 0xbe:
        return this.ldx(0xbe, "absoluteY");
      case 0xbf:
        return this.illegal(0xbf);
      case 0xc0:
        return this.cpy(0xc0, "immediate");
      case 0xc1:
        return this.cmp(0xc1, "indirectX");
      case 0xc2:
        return this.illegal(0xc2);
      case 0xc3:
        return this.illegal(0xc3);
      case 0xc4:
        return this.cpy(0xc4, "zeropage");
      case 0xc5:
        return this.cmp(0xc5, "zeropage");
      case 0xc6:
        return this.dec(0xc6, "zeropage");
      case 0xc7:
        return this.illegal(0xc7);
      case 0xc8:
        return this.iny(0xc8, "implied");
      case 0xc9:
        return this.cmp(0xc9, "immediate");
      case 0xca:
        return this.dex(0xca, "implied");
      case 0xcb:
        return this.illegal(0xcb);
      case 0xcc:
        return this.cpy(0xcc, "absolute");
      case 0xcd:
        return this.cmp(0xcd, "absolute");
      case 0xce:
        return this.dec(0xce, "absolute");
      case 0xcf:
        return this.illegal(0xcf);
      case 0xd0:
        return this.bne(0xd0, "relative");
      case 0xd1:
        return this.cmp(0xd1, "indirectY");
      case 0xd3:
        return this.illegal(0xd3);
      case 0xd4:
        return this.illegal(0xd4);
      case 0xd5:
        return this.cmp(0xd5, "zeropageX");
      case 0xd6:
        return this.dec(0xd6, "zeropageX");
      case 0xd7:
        return this.illegal(0xd7);
      case 0xd8:
        return this.cld(0xd8, "implied");
      case 0xd9:
        return this.cmp(0xd9, "absoluteY");
      case 0xda:
        return this.illegal(0xda);
      case 0xdb:
        return this.illegal(0xdb);
      case 0xdc:
        return this.illegal(0xdc);
      case 0xdd:
        return this.cmp(0xdd, "absoluteX");
      case 0xde:
        return this.dec(0xde, "absoluteX");
      case 0xdf:
        return this.illegal(0xdf);
      case 0xe0:
        return this.cpx(0xe0, "immediate");
      case 0xe1:
        return this.sbc(0xe1, "indirectX");
      case 0xe2:
        return this.illegal(0xe2);
      case 0xe3:
        return this.illegal(0xe3);
      case 0xe4:
        return this.cpx(0xe4, "zeropage");
      case 0xe5:
        return this.sbc(0xe5, "zeropage");
      case 0xe6:
        return this.inc(0xe6, "zeropage");
      case 0xe7:
        return this.illegal(0xe7);
      case 0xe8:
        return this.inx(0xe8, "implied");
      case 0xe9:
        return this.sbc(0xe9, "immediate");
      case 0xea:
        return this.nop(0xea, "implied");
      case 0xeb:
        return this.illegal(0xeb);
      case 0xec:
        return this.cpx(0xec, "absolute");
      case 0xed:
        return this.sbc(0xed, "absolute");
      case 0xee:
        return this.inc(0xee, "absolute");
      case 0xef:
        return this.illegal(0xef);
      case 0xf0:
        return this.beq(0xf0, "relative");
      case 0xf1:
        return this.sbc(0xf1, "indirectY");
      case 0xf3:
        return this.illegal(0xf3);
      case 0xf4:
        return this.illegal(0xf4);
      case 0xf5:
        return this.sbc(0xf5, "zeropageX");
      case 0xf6:
        return this.inc(0xf6, "zeropageX");
      case 0xf7:
        return this.illegal(0xf7);
      case 0xf8:
        return this.sed(0xf8, "implied");
      case 0xf9:
        return this.sbc(0xf9, "absoluteY");
      case 0xfa:
        return this.illegal(0xfa);
      case 0xfb:
        return this.illegal(0xfb);
      case 0xfc:
        return this.illegal(0xfc);
      case 0xfd:
        return this.sbc(0xfd, "absoluteX");
      case 0xfe:
        return this.inc(0xfe, "absoluteX");
      case 0xff:
        return this.illegal(0xff);
      default:
        throw new Error(
          `invalid opcode! ${NumUtils.toHexString(
            opcode
          )} , ${NumUtils.toHexString(this.registers.pc.get())}`
        );
    }
  }

  private illegal(opcode: number) {
    throw Error(`illegal opcode ${opcode.toString(16)} detected.`);
  }

  private brk(opcode: number, addressingMode: "implied") {
    this.registers.s.b = 1;
    // TODO: スタックにpushする。その後、bフラグを0に戻す
    // https://www.masswerk.at/6502/6502_instruction_set.html#BRK
  }

  private ora(
    opcode: number,
    addressingMode:
      | "indirectX"
      | "zeropage"
      | "zeropageX"
      | "immediate"
      | "absolute"
      | "absoluteX"
      | "absoluteY"
      | "indirectY"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "immediate" ? operand : this.bus.read(operand);
    const result = this.registers.a.get() | value;

    this.registers.a.set(result);

    this.updateStatus(result, ["n", "z"]);
  }

  private asl(
    opcode: number,
    addressingMode:
      | "accumulator"
      | "zeropage"
      | "absolute"
      | "absoluteX"
      | "zeropageX"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "accumulator" ? operand : this.bus.read(operand);
    const result = value << 1;
    const bitValue = NumUtils.to8Bit(result);

    if (addressingMode === "accumulator") {
      this.registers.a.set(bitValue);
    } else {
      this.bus.write(operand, bitValue);
    }

    this.updateStatus(bitValue, ["n", "z"]);
    this.registers.s.c = result > 0xff ? 1 : 0;
  }

  private php(opcode: number, addressingMode: "implied") {
    // https://www.nesdev.org/wiki/Status_flags#The_B_flag
    this.registers.s.b = 1;
    this.pushToStack(this.registers.s.get());
    this.registers.s.b = 0;
  }

  private bpl(opcode: number, addressingMode: "relative") {
    const operand = this.getOperand(addressingMode);
    if (this.registers.s.n === 0) {
      this.registers.pc.set(operand);
    }
  }

  private clc(opcode: number, addressingMode: "implied") {
    this.registers.s.c = 0;
  }

  private jsr(opcode: number, addressingMode: "relative" | "absolute") {
    const address = this.getOperand(addressingMode);

    // 次の命令のアドレス - 1の2byte分をstackにpushする
    const returnAddress = this.registers.pc.get() - 1;
    const returnAddressUpper = returnAddress >> 8;
    const returnAddressLower = returnAddress & 0xff;

    this.pushToStack(returnAddressUpper);
    this.pushToStack(returnAddressLower);
    this.registers.pc.set(address);
  }

  private and(
    opcode: number,
    addressingMode:
      | "indirectX"
      | "zeropage"
      | "zeropageX"
      | "immediate"
      | "absolute"
      | "absoluteX"
      | "absoluteY"
      | "indirectY"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "immediate" ? operand : this.bus.read(operand);
    const result = this.registers.a.get() & value;
    this.registers.a.set(result);

    this.updateStatus(result, ["n", "z"]);
  }

  // bits 7 and 6 of operand are transfered to bit 7 and 6 of SR (N,V);
  // the zero-flag is set according to the result of the operand AND
  // the accumulator (set, if the result is zero, unset otherwise).
  // This allows a quick check of a few bits at once without affecting
  // any of the registers, other than the status register (SR).
  private bit(opcode: number, addressingMode: "zeropage" | "absolute") {
    const value = this.bus.read(this.getOperand(addressingMode));
    const andResult = this.registers.a.get() & value;

    this.registers.s.n = NumUtils.getNthBit(value, 7);
    this.registers.s.v = NumUtils.getNthBit(value, 6);
    this.registers.s.z = andResult === 0 ? 1 : 0;
  }

  private rol(
    opcode: number,
    addressingMode:
      | "zeropage"
      | "accumulator"
      | "absolute"
      | "zeropageX"
      | "absoluteX"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "accumulator" ? operand : this.bus.read(operand);
    const carry = this.registers.s.c === 1 ? 0b00000001 : 0b00000000;
    const result = (value << 1) | carry;
    const bit8Result = NumUtils.to8Bit(result);

    if (addressingMode === "accumulator") {
      this.registers.a.set(bit8Result);
    } else {
      this.bus.write(operand, bit8Result);
    }

    this.updateStatus(bit8Result, ["n", "z"]);
    this.registers.s.c = NumUtils.getNthBit(value, 7);
  }

  // The status register will be pulled with the break flag and bit 5 ignored.
  private plp(opcode: number, addressingMode: "implied") {
    this.registers.s.set(this.popToStack());
    this.registers.s.b = 0;
  }

  private bmi(opcode: number, addressingMode: "relative") {
    const operand = this.getOperand(addressingMode);
    if (this.registers.s.n === 1) {
      this.registers.pc.set(operand);
    }
  }

  private sec(opcode: number, addressingMode: "implied") {
    this.registers.s.c = 1;
  }

  private rti(opcode: number, addressingMode: "implied") {
    const statusFlags = this.popToStack();
    const returnAddressLower = this.popToStack();
    const returnAddressUpper = this.popToStack();
    const counter = NumUtils.fromBytes(returnAddressLower, returnAddressUpper);
    this.registers.pc.set(counter);
    this.registers.s.set(statusFlags);
  }

  private eor(
    opcode: number,
    addressingMode:
      | "indirectX"
      | "indirectY"
      | "zeropage"
      | "zeropageX"
      | "zeropageY"
      | "absoluteY"
      | "immediate"
      | "absolute"
      | "absoluteX"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "immediate" ? operand : this.bus.read(operand);
    const result = this.registers.a.get() ^ value;
    this.registers.a.set(result);

    this.updateStatus(result, ["n", "z"]);
  }

  private lsr(
    opcode: number,
    addressingMode:
      | "zeropage"
      | "accumulator"
      | "absolute"
      | "absoluteX"
      | "zeropageX"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "accumulator" ? operand : this.bus.read(operand);
    const result = value >> 1;
    const bitValue = NumUtils.to8Bit(result);

    if (addressingMode === "accumulator") {
      this.registers.a.set(bitValue);
    } else {
      this.bus.write(operand, bitValue);
    }

    this.updateStatus(bitValue, ["n", "z"]);
    this.registers.s.c = result <= 0 ? 1 : 0;
  }

  private pha(opcode: number, addressingMode: "implied") {
    this.pushToStack(this.registers.a.get());
  }

  private bvc(opcode: number, addressingMode: "relative") {
    const operand = this.getOperand(addressingMode);
    if (this.registers.s.v === 0) {
      this.registers.pc.set(operand);
    }
  }

  private cli(opcode: number, addressingMode: "implied") {
    this.registers.s.i = 1;
  }

  private rts(opcode: number, addressingMode: "implied") {
    // // 戻りアドレスを pop し、そのアドレスに 1 を加えたアドレスへジャンプ
    const returnAddressLower = this.popToStack();
    const returnAddressUpper = this.popToStack();
    const returnAddress =
      NumUtils.fromBytes(returnAddressLower, returnAddressUpper) + 1;

    this.registers.pc.set(returnAddress);
  }

  private jmp(opcode: number, addressingMode: "absolute" | "indirect") {
    this.registers.pc.set(this.getOperand(addressingMode));
  }

  private adc(
    opcode: number,
    addressingMode:
      | "indirectX"
      | "zeropage"
      | "zeropageX"
      | "immediate"
      | "absolute"
      | "indirectY"
      | "absoluteY"
      | "absoluteX"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "immediate" ? operand : this.bus.read(operand);
    const a = this.registers.a.get();
    const result = a + value + this.registers.s.c;
    const bit8Result = NumUtils.to8Bit(result);

    this.updateStatus(bit8Result, ["n", "z"]);
    this.registers.s.v =
      NumUtils.getNthBit(a, 7) === NumUtils.getNthBit(value, 7) &&
      NumUtils.getNthBit(a, 7) !== NumUtils.getNthBit(bit8Result, 7)
        ? 1
        : 0;
    this.registers.s.c = result > 0xff ? 1 : 0;
    this.registers.a.set(bit8Result);
  }

  private ror(
    opcode: number,
    addressingMode:
      | "indirectX"
      | "zeropage"
      | "zeropageX"
      | "immediate"
      | "accumulator"
      | "absolute"
      | "absoluteX"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "accumulator" ? operand : this.bus.read(operand);
    const carry = this.registers.s.c === 1 ? 0b10000000 : 0b00000000;
    const result = carry | (value >> 1);
    const bit8Result = NumUtils.to8Bit(result);

    if (addressingMode === "accumulator") {
      this.registers.a.set(bit8Result);
    } else {
      this.bus.write(operand, bit8Result);
    }

    this.updateStatus(bit8Result, ["n", "z"]);
    this.registers.s.c = NumUtils.getNthBit(value, 0);
  }

  private pla(opcode: number, addressingMode: "implied") {
    const value = this.popToStack();
    this.registers.a.set(value);
    this.updateStatus(value, ["n", "z"]);
  }

  private bvs(opcode: number, addressingMode: "relative") {
    const operand = this.getOperand(addressingMode);
    if (this.registers.s.v === 1) {
      this.registers.pc.set(operand);
    }
  }

  private sei(opcode: number, addressingMode: "implied") {
    this.registers.s.i = 1;
  }

  private txa(opcode: number, addressingMode: "implied") {
    this.registers.a.set(this.registers.x.get());
    this.updateStatus(this.registers.a.get(), ["n", "z"]);
  }

  private tax(opcode: number, addressingMode: "implied") {
    this.registers.x.set(this.registers.a.get());
    this.updateStatus(this.registers.x.get(), ["n", "z"]);
  }

  private txs(opcode: number, addressingMode: "implied") {
    this.registers.stackPointer.set(this.registers.x.get());
  }

  private tya(opcode: number, addressingMode: "implied") {
    this.registers.a.set(this.registers.y.get());
    this.updateStatus(this.registers.a.get(), ["n", "z"]);
  }

  private tay(opcode: number, addressingMode: "implied") {
    this.registers.y.set(this.registers.a.get());
    this.updateStatus(this.registers.y.get(), ["n", "z"]);
  }

  private lda(
    opcode: number,
    addressingMode:
      | "zeropage"
      | "zeropageX"
      | "zeropageY"
      | "immediate"
      | "absolute"
      | "absoluteX"
      | "absoluteY"
      | "indirectY"
      | "indirectX"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "immediate" ? operand : this.bus.read(operand);
    this.registers.a.set(value);
    this.updateStatus(value, ["n", "z"]);
  }

  private ldx(
    opcode: number,
    addressingMode:
      | "zeropage"
      | "zeropageY"
      | "immediate"
      | "absolute"
      | "absoluteY"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "immediate" ? operand : this.bus.read(operand);
    this.registers.x.set(value);
    this.updateStatus(value, ["n", "z"]);
  }

  private ldy(
    opcode: number,
    addressingMode:
      | "zeropage"
      | "zeropageX"
      | "immediate"
      | "absolute"
      | "absoluteX"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "immediate" ? operand : this.bus.read(operand);
    this.registers.y.set(value);
    this.updateStatus(value, ["n", "z"]);
  }

  private sta(
    opcode: number,
    addressingMode:
      | "indirectX"
      | "zeropage"
      | "absolute"
      | "absoluteY"
      | "absoluteX"
      | "indirectY"
      | "zeropageX"
  ) {
    this.bus.write(this.getOperand(addressingMode), this.registers.a.get());
  }

  private stx(
    opcode: number,
    addressingMode: "indirectX" | "zeropage" | "absolute" | "zeropageY"
  ) {
    this.bus.write(this.getOperand(addressingMode), this.registers.x.get());
  }

  private sty(
    opcode: number,
    addressingMode: "indirectX" | "zeropage" | "absolute" | "zeropageX"
  ) {
    this.bus.write(this.getOperand(addressingMode), this.registers.y.get());
  }

  private bcc(opcode: number, addressingMode: "relative") {
    const operand = this.getOperand(addressingMode);
    if (this.registers.s.c === 0) {
      this.registers.pc.set(operand);
    }
  }

  private bcs(opcode: number, addressingMode: "relative") {
    const operand = this.getOperand(addressingMode);
    if (this.registers.s.c === 1) {
      this.registers.pc.set(operand);
    }
  }

  private clv(opcode: number, addressingMode: "implied") {
    this.registers.s.v = 0;
  }

  private tsx(opcode: number, addressingMode: "implied") {
    this.registers.x.set(this.registers.stackPointer.get());
    this.updateStatus(this.registers.x.get(), ["n", "z"]);
  }

  private cpx(
    opcode: number,
    addressingMode: "immediate" | "zeropage" | "absolute"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "immediate" ? operand : this.bus.read(operand);
    const x = this.registers.x.get();
    const result = x - value;

    this.updateStatus(result, ["n", "z"]);
    // 比較演算の場合は、比較対象より大きい場合はキャリーフラグを立てる
    this.registers.s.c = x >= value ? 1 : 0;
  }

  private cpy(
    opcode: number,
    addressingMode: "immediate" | "zeropage" | "absolute"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "immediate" ? operand : this.bus.read(operand);
    const y = this.registers.y.get();
    const result = y - value;

    this.updateStatus(result, ["n", "z"]);
    // 比較演算の場合は、比較対象より大きい場合はキャリーフラグを立てる
    this.registers.s.c = y >= value ? 1 : 0;
  }

  private cmp(
    opcode: number,
    addressingMode:
      | "immediate"
      | "zeropage"
      | "zeropageX"
      | "indirectX"
      | "absolute"
      | "absoluteX"
      | "absoluteY"
      | "indirectY"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "immediate" ? operand : this.bus.read(operand);
    const a = this.registers.a.get();
    const result = a - value;

    this.updateStatus(result, ["n", "z"]);
    // 比較演算の場合は、比較対象より大きい場合はキャリーフラグを立てる
    this.registers.s.c = a >= value ? 1 : 0;
  }

  private dec(
    opcode: number,
    addressingMode:
      | "immediate"
      | "zeropage"
      | "absolute"
      | "zeropageX"
      | "absoluteX"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "immediate" ? operand : this.bus.read(operand);
    const result = NumUtils.to8Bit(value - 1);

    if (addressingMode !== "immediate") {
      this.bus.write(operand, result);
    }

    this.updateStatus(result, ["n", "z"]);
  }

  private dex(opcode: number, addressingMode: "implied") {
    const value = NumUtils.to8Bit(this.registers.x.get() - 1);
    this.registers.x.set(value);
    this.updateStatus(value, ["n", "z"]);
  }

  private cld(opcode: number, addressingMode: "implied") {
    this.registers.s.d = 0;
  }

  private nop(opcode: number, addressingMode: "implied") {
    return;
  }

  private inc(
    opcode: number,
    addressingMode: "zeropage" | "zeropageX" | "absolute" | "absoluteX"
  ) {
    const operand = this.getOperand(addressingMode);
    const value = NumUtils.to8Bit(this.bus.read(operand) + 1);
    this.bus.write(operand, value);
    this.updateStatus(value, ["n", "z"]);
  }

  private sbc(
    opcode: number,
    addressingMode:
      | "indirectX"
      | "indirectY"
      | "zeropage"
      | "zeropageX"
      | "zeropageY"
      | "immediate"
      | "absolute"
      | "absoluteY"
      | "absoluteX"
  ) {
    const operand = this.getOperand(addressingMode);
    const value =
      addressingMode === "immediate" ? operand : this.bus.read(operand);
    const a = this.registers.a.get();
    const result = a - value - (1 - this.registers.s.c);
    const bit8Result = NumUtils.to8Bit(result);

    this.updateStatus(bit8Result, ["n", "z"]);
    this.registers.s.v =
      NumUtils.getNthBit(a, 7) !== NumUtils.getNthBit(value, 7) &&
      NumUtils.getNthBit(a, 7) !== NumUtils.getNthBit(bit8Result, 7)
        ? 1
        : 0;
    this.registers.s.c = result < 0 ? 0 : 1;
    this.registers.a.set(bit8Result);
  }

  private sed(opcode: number, addressingMode: "implied") {
    this.registers.s.d = 1;
  }

  private beq(opcode: number, addressingMode: "relative") {
    const operand = this.getOperand(addressingMode);
    if (this.registers.s.z === 1) {
      this.registers.pc.set(operand);
    }
  }

  private inx(opcode: number, addressingMode: "implied") {
    const value = NumUtils.to8Bit(this.registers.x.get() + 1);
    this.registers.x.set(value);
    this.updateStatus(value, ["n", "z"]);
  }

  private iny(opcode: number, addressingMode: "implied") {
    const value = NumUtils.to8Bit(this.registers.y.get() + 1);
    this.registers.y.set(value);
    this.updateStatus(value, ["n", "z"]);
  }

  private dey(opcode: number, addressingMode: "implied") {
    const value = NumUtils.to8Bit(this.registers.y.get() - 1);
    this.registers.y.set(value);
    this.updateStatus(value, ["n", "z"]);
  }

  private bne(opcode: number, addressingMode: "relative") {
    const operand = this.getOperand(addressingMode);
    if (this.registers.s.z === 0) {
      this.registers.pc.set(operand);
    }
  }

  private updateStatus(value: number, updateFlags: Array<"n" | "z" | "c">) {
    if (updateFlags.includes("n")) {
      this.registers.s.n = NumUtils.getNthBit(value, 7);
    }
    if (updateFlags.includes("z")) {
      this.registers.s.z = value === 0 ? 1 : 0;
    }
  }

  private pushToStack(data: number) {
    const stackAddress = NumUtils.to16Bit(
      this.registers.stackPointer.get() + 0x0100
    );
    this.bus.write(stackAddress, data);
    this.registers.stackPointer.set(this.registers.stackPointer.get() - 1);
  }

  private popToStack() {
    this.registers.stackPointer.set(this.registers.stackPointer.get() + 1);
    const stackAddress = NumUtils.to16Bit(
      this.registers.stackPointer.get() + 0x0100
    );
    return this.bus.read(stackAddress);
  }

  // d,x	Zero page indexed	val = PEEK((arg + X) % 256)	4
  // d,y	Zero page indexed	val = PEEK((arg + Y) % 256)	4
  // a,x	Absolute indexed	val = PEEK(arg + X)	4+
  // a,y	Absolute indexed	val = PEEK(arg + Y)	4+
  // (d,x)	Indexed indirect	val = PEEK(PEEK((arg + X) % 256) + PEEK((arg + X + 1) % 256) * 256)	6
  // (d),y	Indirect indexed	val = PEEK(PEEK(arg) + PEEK((arg + 1) % 256) * 256 + Y)	5+
  private getOperand(
    mode: Exclude<Opcode["addressingMode"], "implied">
  ): number {
    switch (mode) {
      case "immediate":
      case "zeropage":
        return this.fetch();
      case "accumulator":
        return this.registers.a.get();
      case "relative": {
        const operand = this.fetch();
        const isNegative = NumUtils.getNthBit(operand, 7);
        const value = isNegative ? operand - 0xff - 1 : operand;
        return this.registers.pc.get() + value;
      }
      case "zeropageX":
        return NumUtils.to8Bit(this.fetch() + this.registers.x.get());
      case "zeropageY":
        return NumUtils.to8Bit(this.fetch() + this.registers.y.get());
      //アドレス「アドレス「IM8 + X」の16bit値」の8bit値
      case "indirectX": {
        const base = NumUtils.to8Bit(this.fetch() + this.registers.x.get());
        const lower = this.bus.read(base);
        const upper = this.bus.read(NumUtils.to8Bit(base + 1));
        return NumUtils.fromBytes(lower, upper);
      }
      // アドレス「アドレス「IM8」の16bit値 + Y」の8bit値を
      case "indirectY": {
        const base = this.fetch();
        const lower = this.bus.read(base);
        const upper = this.bus.read(NumUtils.to8Bit(base + 1));

        return NumUtils.to16Bit(
          NumUtils.fromBytes(lower, upper) + this.registers.y.get()
        );
      }
      case "indirect": {
        const lowerByte = this.fetch();
        const upperByte = this.fetch();
        const incrementedLowerByte = NumUtils.to8Bit((lowerByte + 1) % 0x100);
        const lower = this.bus.read(NumUtils.fromBytes(lowerByte, upperByte));
        const upper = this.bus.read(
          NumUtils.fromBytes(incrementedLowerByte, upperByte)
        );
        return NumUtils.fromBytes(lower, upper);
      }
      case "absolute": {
        return NumUtils.fromBytes(this.fetch(), this.fetch());
      }
      case "absoluteX":
        return NumUtils.to16Bit(
          NumUtils.fromBytes(this.fetch(), this.fetch()) +
            this.registers.x.get()
        );
      case "absoluteY":
        return NumUtils.to16Bit(
          NumUtils.fromBytes(this.fetch(), this.fetch()) +
            this.registers.y.get()
        );
    }
  }
}
