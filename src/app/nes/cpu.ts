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
    this.registers.pc = this.registers.pc.inc();
    return new Bit8(this.bus.rom[this.registers.pc.toNumber()]);
  }

  public execute() {
    const opcode = this.fetch().toNumber();

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
          `invalid opcode! ${opcode.toString(
            16
          )} , ${this.registers.pc.toHexString()}`
        );
    }
  }

  private illegal(opcode: number) {
    throw Error(`illegal opcode ${opcode.toString(16)} detected.`);
  }

  private brk(opcode: number, addressingMode: "implied") {
    this.registers.status.b = 1;
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
    throw new Error("unimplemented instruction" + opcode.toString(16));
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
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private php(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private bpl(opcode: number, addressingMode: "relative") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private clc(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  // TODO: スタックへのpush
  private jsr(opcode: number, addressingMode: "relative" | "absolute") {
    const address = this.getValue(addressingMode);
    this.registers.pc = new Bit16(address);
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
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private bit(opcode: number, addressingMode: "zeropage" | "absolute") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
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
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private plp(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private bmi(opcode: number, addressingMode: "relative") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private sec(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private rti(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
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
    throw new Error("unimplemented instruction" + opcode.toString(16));
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
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private pha(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private bvc(opcode: number, addressingMode: "relative") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private cli(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private rts(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private jmp(opcode: number, addressingMode: "absolute" | "indirect") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
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
    throw new Error("unimplemented instruction" + opcode.toString(16));
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
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private pla(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private bvs(opcode: number, addressingMode: "relative") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private sei(opcode: number, addressingMode: "implied") {
    this.registers.status.i = 1;
  }

  private txa(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private tax(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private txs(opcode: number, addressingMode: "implied") {
    this.registers.stackPointer = this.registers.x;
  }

  private tya(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private tay(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  // TODO: 即値とアドレスを判定する
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
    this.registers.a = new Bit8(this.getValue(addressingMode));
  }

  // TODO: 即値とアドレスを判定する
  private ldx(
    opcode: number,
    addressingMode:
      | "zeropage"
      | "zeropageY"
      | "immediate"
      | "absolute"
      | "absoluteY"
  ) {
    this.registers.x = new Bit8(this.getValue(addressingMode));
  }

  // TODO: 即値とアドレスを判定する
  private ldy(
    opcode: number,
    addressingMode:
      | "zeropage"
      | "zeropageX"
      | "immediate"
      | "absolute"
      | "absoluteX"
  ) {
    this.registers.y = new Bit8(this.getValue(addressingMode));
  }

  // TODO: 即値とアドレスを判定する
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
    this.bus.ram.set(this.getValue(addressingMode), this.registers.a);
  }

  // TODO: 即値とアドレスを判定する
  private stx(
    opcode: number,
    addressingMode: "indirectX" | "zeropage" | "absolute" | "zeropageY"
  ) {
    this.bus.ram.set(this.getValue(addressingMode), this.registers.x);
  }

  // TODO: 即値とアドレスを判定する
  private sty(
    opcode: number,
    addressingMode: "indirectX" | "zeropage" | "absolute" | "zeropageX"
  ) {
    this.bus.ram.set(this.getValue(addressingMode), this.registers.y);
  }

  private bcc(opcode: number, addressingMode: "relative") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private bcs(opcode: number, addressingMode: "relative") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private clv(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private tsx(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private cpx(
    opcode: number,
    addressingMode: "immediate" | "zeropage" | "absolute"
  ) {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private cpy(
    opcode: number,
    addressingMode: "immediate" | "zeropage" | "absolute"
  ) {
    throw new Error("unimplemented instruction" + opcode.toString(16));
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
    throw new Error("unimplemented instruction" + opcode.toString(16));
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
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private dex(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private cld(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private nop(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private inc(
    opcode: number,
    addressingMode: "zeropage" | "zeropageX" | "absolute" | "absoluteX"
  ) {
    throw new Error("unimplemented instruction" + opcode.toString(16));
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
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private sed(opcode: number, addressingMode: "implied") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private beq(opcode: number, addressingMode: "relative") {
    throw new Error("unimplemented instruction" + opcode.toString(16));
  }

  private inx(opcode: number, addressingMode: "implied") {
    this.registers.x = this.registers.x.inc();
  }

  private iny(opcode: number, addressingMode: "implied") {
    this.registers.y = this.registers.y.inc();
  }

  private dey(opcode: number, addressingMode: "implied") {
    this.registers.y = this.registers.y.dec();
  }

  private bne(opcode: number, addressingMode: "relative") {
    const relative = new Bit8(this.getValue(addressingMode)).getSignedInt();
    if (this.registers.status.z === 0) {
      this.registers.pc.add(relative);
    }
  }

  // public execute() {
  //   const opcode = this.fetch().toNumber();
  //   const { mnemonics, addressingMode } = OPCODES[opcode];

  //   switch (true) {
  //     case mnemonics.includes("INS"):
  //       this.registers.status.i = 1;
  //       break;
  //     case mnemonics.includes("SEI"):
  //       this.registers.status.i = 1;
  //       break;
  //     case mnemonics.includes("BRK"):
  //       this.registers.status.b = 1;
  //       break;
  //     case mnemonics.includes("TXS"):
  //       this.registers.stackPointer = this.registers.x;
  //       break;
  //     case mnemonics.includes("LDA"):
  //       this.registers.a = new Bit8(this.getValue(addressingMode));
  //       break;
  //     case mnemonics.includes("LDX"):
  //       this.registers.x = new Bit8(this.getValue(addressingMode));
  //       break;
  //     case mnemonics.includes("LDY"):
  //       this.registers.y = new Bit8(this.getValue(addressingMode));
  //       break;
  //     case mnemonics.includes("STA"):
  //       this.bus.ram.set(this.getValue(addressingMode), this.registers.a);
  //       break;
  //     case mnemonics.includes("INX"): {
  //       this.registers.x.inc();
  //       break;
  //     }
  //     case mnemonics.includes("ISC"): {
  //       const address = this.getValue(addressingMode);
  //       const value = this.bus.ram.get(address);
  //       value.add(1);
  //       this.bus.ram.set(address, value);
  //       break;
  //     }
  //     case mnemonics.includes("DEY"): {
  //       this.registers.y.dec();
  //       break;
  //     }
  //     case mnemonics.includes("BNE"): {
  //       const relative = new Bit8(this.getValue(addressingMode)).getSignedInt();
  //       if (this.registers.status.z === 0) {
  //         this.registers.pc.add(relative);
  //       }
  //       break;
  //     }
  //     case mnemonics.includes("JSR"): {
  //       const address = this.getValue(addressingMode);
  //       this.registers.pc = new Bit16(address);
  //       break;
  //     }
  //     default:
  //       throw new Error(
  //         `invalid opcode! ${opcode.toString(
  //           16
  //         )} , ${this.registers.pc.toHexString()}`
  //       );
  //   }
  // }

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
        return this.registers.a.toNumber();
      case "relative":
      case "immediate":
      case "zeropage":
        return this.fetch().toNumber();
      case "zeropageX":
      case "zeropageY": {
        const register =
          mode === "zeropageX" ? this.registers.x : this.registers.y;
        return this.fetch().add(register).toNumber();
      }
      case "indirect":
      case "indirectX":
      case "indirectY":
      case "absolute": {
        const bit16 = Bit16.fromBytes(this.fetch(), this.fetch());
        return bit16.toNumber();
      }
      case "absoluteX":
      case "absoluteY": {
        const register =
          mode === "absoluteX" ? this.registers.x : this.registers.y;
        const bit16 = Bit16.fromBytes(this.fetch(), this.fetch());
        bit16.add(register);
        return bit16.toNumber();
      }
    }
  }
}
