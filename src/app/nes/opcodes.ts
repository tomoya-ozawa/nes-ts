export type Opcode = {
  mnemonics: string[];
  addressingMode:
    | "implied"
    | "indirect"
    | "indirectX"
    | "indirectY"
    | "zeropage"
    | "zeropageX"
    | "zeropageY"
    | "immediate"
    | "accumulator"
    | "relative"
    | "absolute"
    | "absoluteX"
    | "absoluteY";
  cycles: number;
  pageBoundaryCycle: boolean;
  illegal: boolean;
};

const OPCODES: { [key: number]: Opcode } = {
  0x0: {
    mnemonics: ["BRK"],
    addressingMode: "implied",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x1: {
    mnemonics: ["ORA"],
    addressingMode: "indirectX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  // 0x2: { mnemonics: ["JAM", "KIL", "HLT"], illegal: true },
  0x3: {
    mnemonics: ["SLO", "ASO"],
    addressingMode: "indirectX",
    cycles: 8,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x4: {
    mnemonics: ["NOP"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x5: {
    mnemonics: ["ORA"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x6: {
    mnemonics: ["ASL"],
    addressingMode: "zeropage",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x7: {
    mnemonics: ["SLO", "ASO"],
    addressingMode: "zeropage",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x8: {
    mnemonics: ["PHP"],
    addressingMode: "implied",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x9: {
    mnemonics: ["ORA"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xa: {
    mnemonics: ["ASL"],
    addressingMode: "accumulator",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xb: {
    mnemonics: ["ANC"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xc: {
    mnemonics: ["NOP"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xd: {
    mnemonics: ["ORA"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xe: {
    mnemonics: ["ASL"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xf: {
    mnemonics: ["SLO", "ASO"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x10: {
    mnemonics: ["BPL"],
    addressingMode: "relative",
    cycles: 2,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x11: {
    mnemonics: ["ORA"],
    addressingMode: "indirectY",
    cycles: 5,
    pageBoundaryCycle: true,
    illegal: false,
  },
  // 0x12: { mnemonics: ["JAM", "KIL", "HLT"], illegal: true },
  0x13: {
    mnemonics: ["SLO", "ASO"],
    addressingMode: "indirectY",
    cycles: 8,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x14: {
    mnemonics: ["NOP"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x15: {
    mnemonics: ["ORA"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x16: {
    mnemonics: ["ASL"],
    addressingMode: "zeropageX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x17: {
    mnemonics: ["SLO", "ASO"],
    addressingMode: "zeropageX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x18: {
    mnemonics: ["CLC"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x19: {
    mnemonics: ["ORA"],
    addressingMode: "absoluteY",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x1a: {
    mnemonics: ["NOP"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x1b: {
    mnemonics: ["SLO", "ASO"],
    addressingMode: "absoluteY",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x1c: {
    mnemonics: ["NOP"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: true,
  },
  0x1d: {
    mnemonics: ["ORA"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x1e: {
    mnemonics: ["ASL"],
    addressingMode: "absoluteX",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x1f: {
    mnemonics: ["SLO", "ASO"],
    addressingMode: "absoluteX",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x20: {
    mnemonics: ["JSR"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x21: {
    mnemonics: ["AND"],
    addressingMode: "indirectX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  // 0x22: { mnemonics: ["JAM", "KIL", "HLT"], illegal: true },
  0x23: {
    mnemonics: ["RLA"],
    addressingMode: "indirectX",
    cycles: 8,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x24: {
    mnemonics: ["BIT"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x25: {
    mnemonics: ["AND"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x26: {
    mnemonics: ["ROL"],
    addressingMode: "zeropage",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x27: {
    mnemonics: ["RLA"],
    addressingMode: "zeropage",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x28: {
    mnemonics: ["PLP"],
    addressingMode: "implied",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x29: {
    mnemonics: ["AND"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x2a: {
    mnemonics: ["ROL"],
    addressingMode: "accumulator",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x2b: {
    mnemonics: ["ANC", "ANC2"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x2c: {
    mnemonics: ["BIT"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x2d: {
    mnemonics: ["AND"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x2e: {
    mnemonics: ["ROL"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x2f: {
    mnemonics: ["RLA"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x30: {
    mnemonics: ["BMI"],
    addressingMode: "relative",
    cycles: 2,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x31: {
    mnemonics: ["AND"],
    addressingMode: "indirectY",
    cycles: 5,
    pageBoundaryCycle: true,
    illegal: false,
  },
  // 0x32: { mnemonics: ["JAM", "KIL", "HLT"], illegal: true },
  0x33: {
    mnemonics: ["RLA"],
    addressingMode: "indirectY",
    cycles: 8,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x34: {
    mnemonics: ["NOP"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x35: {
    mnemonics: ["AND"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x36: {
    mnemonics: ["ROL"],
    addressingMode: "zeropageX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x37: {
    mnemonics: ["RLA"],
    addressingMode: "zeropageX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x38: {
    mnemonics: ["SEC"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x39: {
    mnemonics: ["AND"],
    addressingMode: "absoluteY",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x3a: {
    mnemonics: ["NOP"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x3b: {
    mnemonics: ["RLA"],
    addressingMode: "absoluteY",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x3c: {
    mnemonics: ["NOP"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: true,
  },
  0x3d: {
    mnemonics: ["AND"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x3e: {
    mnemonics: ["ROL"],
    addressingMode: "absoluteX",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x3f: {
    mnemonics: ["RLA"],
    addressingMode: "absoluteX",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x40: {
    mnemonics: ["RTI"],
    addressingMode: "implied",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x41: {
    mnemonics: ["EOR"],
    addressingMode: "indirectX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  // 0x42: { mnemonics: ["JAM", "KIL", "HLT"], illegal: true },
  0x43: {
    mnemonics: ["SRE", "LSE"],
    addressingMode: "indirectX",
    cycles: 8,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x44: {
    mnemonics: ["NOP"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x45: {
    mnemonics: ["EOR"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x46: {
    mnemonics: ["LSR"],
    addressingMode: "zeropage",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x47: {
    mnemonics: ["SRE", "LSE"],
    addressingMode: "zeropage",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x48: {
    mnemonics: ["PHA"],
    addressingMode: "implied",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x49: {
    mnemonics: ["EOR"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x4a: {
    mnemonics: ["LSR"],
    addressingMode: "accumulator",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x4b: {
    mnemonics: ["ALR", "ASR"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x4c: {
    mnemonics: ["JMP"],
    addressingMode: "absolute",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x4d: {
    mnemonics: ["EOR"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x4e: {
    mnemonics: ["LSR"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x4f: {
    mnemonics: ["SRE", "LSE"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x50: {
    mnemonics: ["BVC"],
    addressingMode: "relative",
    cycles: 2,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x51: {
    mnemonics: ["EOR"],
    addressingMode: "indirectY",
    cycles: 5,
    pageBoundaryCycle: true,
    illegal: false,
  },
  // 0x52: { mnemonics: ["JAM", "KIL", "HLT"], illegal: true },
  0x53: {
    mnemonics: ["SRE", "LSE"],
    addressingMode: "indirectY",
    cycles: 8,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x54: {
    mnemonics: ["NOP"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x55: {
    mnemonics: ["EOR"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x56: {
    mnemonics: ["LSR"],
    addressingMode: "zeropageX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x57: {
    mnemonics: ["SRE", "LSE"],
    addressingMode: "zeropageX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x58: {
    mnemonics: ["CLI"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x59: {
    mnemonics: ["EOR"],
    addressingMode: "absoluteY",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x5a: {
    mnemonics: ["NOP"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x5b: {
    mnemonics: ["SRE", "LSE"],
    addressingMode: "absoluteY",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x5c: {
    mnemonics: ["NOP"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: true,
  },
  0x5d: {
    mnemonics: ["EOR"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x5e: {
    mnemonics: ["LSR"],
    addressingMode: "absoluteX",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x5f: {
    mnemonics: ["SRE", "LSE"],
    addressingMode: "absoluteX",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x60: {
    mnemonics: ["RTS"],
    addressingMode: "implied",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x61: {
    mnemonics: ["ADC"],
    addressingMode: "indirectX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  // 0x62: { mnemonics: ["JAM", "KIL", "HLT"], illegal: true },
  0x63: {
    mnemonics: ["RRA"],
    addressingMode: "indirectX",
    cycles: 8,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x64: {
    mnemonics: ["NOP"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x65: {
    mnemonics: ["ADC"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x66: {
    mnemonics: ["ROR"],
    addressingMode: "zeropage",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x67: {
    mnemonics: ["RRA"],
    addressingMode: "zeropage",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x68: {
    mnemonics: ["PLA"],
    addressingMode: "implied",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x69: {
    mnemonics: ["ADC"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x6a: {
    mnemonics: ["ROR"],
    addressingMode: "accumulator",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x6b: {
    mnemonics: ["ARR"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x6c: {
    mnemonics: ["JMP"],
    addressingMode: "indirect",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x6d: {
    mnemonics: ["ADC"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x6e: {
    mnemonics: ["ROR"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x6f: {
    mnemonics: ["RRA"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x70: {
    mnemonics: ["BVS"],
    addressingMode: "relative",
    cycles: 2,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x71: {
    mnemonics: ["ADC"],
    addressingMode: "indirectY",
    cycles: 5,
    pageBoundaryCycle: true,
    illegal: false,
  },
  // 0x72: { mnemonics: ["JAM", "KIL", "HLT"], illegal: true },
  0x73: {
    mnemonics: ["RRA"],
    addressingMode: "indirectY",
    cycles: 8,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x74: {
    mnemonics: ["NOP"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x75: {
    mnemonics: ["ADC"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x76: {
    mnemonics: ["ROR"],
    addressingMode: "zeropageX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x77: {
    mnemonics: ["RRA"],
    addressingMode: "zeropageX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x78: {
    mnemonics: ["SEI"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x79: {
    mnemonics: ["ADC"],
    addressingMode: "absoluteY",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x7a: {
    mnemonics: ["NOP"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x7b: {
    mnemonics: ["RRA"],
    addressingMode: "absoluteY",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x7c: {
    mnemonics: ["NOP"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: true,
  },
  0x7d: {
    mnemonics: ["ADC"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x7e: {
    mnemonics: ["ROR"],
    addressingMode: "absoluteX",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x7f: {
    mnemonics: ["RRA"],
    addressingMode: "absoluteX",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x80: {
    mnemonics: ["NOP"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x81: {
    mnemonics: ["STA"],
    addressingMode: "indirectX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x82: {
    mnemonics: ["NOP"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x83: {
    mnemonics: ["SAX", "AXS", "AAX"],
    addressingMode: "indirectX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x84: {
    mnemonics: ["STY"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x85: {
    mnemonics: ["STA"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x86: {
    mnemonics: ["STX"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x87: {
    mnemonics: ["SAX", "AXS", "AAX"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x88: {
    mnemonics: ["DEY"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x89: {
    mnemonics: ["NOP"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x8a: {
    mnemonics: ["TXA"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x8b: {
    mnemonics: ["ANE", "XAA"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x8c: {
    mnemonics: ["STY"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x8d: {
    mnemonics: ["STA"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x8e: {
    mnemonics: ["STX"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x8f: {
    mnemonics: ["SAX", "AXS", "AAX"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x90: {
    mnemonics: ["BCC"],
    addressingMode: "relative",
    cycles: 2,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0x91: {
    mnemonics: ["STA"],
    addressingMode: "indirectY",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  // 0x92: { mnemonics: ["JAM", "KIL", "HLT"], illegal: true },
  0x93: {
    mnemonics: ["SHA", "AHX", "AXA"],
    addressingMode: "indirectY",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x94: {
    mnemonics: ["STY"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x95: {
    mnemonics: ["STA"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x96: {
    mnemonics: ["STX"],
    addressingMode: "zeropageY",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x97: {
    mnemonics: ["SAX", "AXS", "AAX"],
    addressingMode: "zeropageY",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x98: {
    mnemonics: ["TYA"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x99: {
    mnemonics: ["STA"],
    addressingMode: "absoluteY",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x9a: {
    mnemonics: ["TXS"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x9b: {
    mnemonics: ["TAS", "XAS", "SHS"],
    addressingMode: "absoluteY",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x9c: {
    mnemonics: ["SHY", "A11", "SYA", "SAY"],
    addressingMode: "absoluteX",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x9d: {
    mnemonics: ["STA"],
    addressingMode: "absoluteX",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0x9e: {
    mnemonics: ["SHX", "A11", "SXA", "XAS"],
    addressingMode: "absoluteY",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0x9f: {
    mnemonics: ["SHA", "AHX", "AXA"],
    addressingMode: "absoluteY",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xa0: {
    mnemonics: ["LDY"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xa1: {
    mnemonics: ["LDA"],
    addressingMode: "indirectX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xa2: {
    mnemonics: ["LDX"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xa3: {
    mnemonics: ["LAX"],
    addressingMode: "indirectX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xa4: {
    mnemonics: ["LDY"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xa5: {
    mnemonics: ["LDA"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xa6: {
    mnemonics: ["LDX"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xa7: {
    mnemonics: ["LAX"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xa8: {
    mnemonics: ["TAY"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xa9: {
    mnemonics: ["LDA"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xaa: {
    mnemonics: ["TAX"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xab: {
    mnemonics: ["LXA", "LAX", "immediate"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xac: {
    mnemonics: ["LDY"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xad: {
    mnemonics: ["LDA"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xae: {
    mnemonics: ["LDX"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xaf: {
    mnemonics: ["LAX"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xb0: {
    mnemonics: ["BCS"],
    addressingMode: "relative",
    cycles: 2,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0xb1: {
    mnemonics: ["LDA"],
    addressingMode: "indirectY",
    cycles: 5,
    pageBoundaryCycle: true,
    illegal: false,
  },
  // 0xb2: { mnemonics: ["JAM", "KIL", "HLT"], illegal: true },
  0xb3: {
    mnemonics: ["LAX"],
    addressingMode: "indirectY",
    cycles: 5,
    pageBoundaryCycle: true,
    illegal: true,
  },
  0xb4: {
    mnemonics: ["LDY"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xb5: {
    mnemonics: ["LDA"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xb6: {
    mnemonics: ["LDX"],
    addressingMode: "zeropageY",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xb7: {
    mnemonics: ["LAX"],
    addressingMode: "zeropageY",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xb8: {
    mnemonics: ["CLV"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xb9: {
    mnemonics: ["LDA"],
    addressingMode: "absoluteY",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0xba: {
    mnemonics: ["TSX"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xbb: {
    mnemonics: ["LAS", "LAR"],
    addressingMode: "absoluteY",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: true,
  },
  0xbc: {
    mnemonics: ["LDY"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0xbd: {
    mnemonics: ["LDA"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0xbe: {
    mnemonics: ["LDX"],
    addressingMode: "absoluteY",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0xbf: {
    mnemonics: ["LAX"],
    addressingMode: "absoluteY",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: true,
  },
  0xc0: {
    mnemonics: ["CPY"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xc1: {
    mnemonics: ["CMP"],
    addressingMode: "indirectX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xc2: {
    mnemonics: ["NOP"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xc3: {
    mnemonics: ["DCP", "DCM"],
    addressingMode: "indirectX",
    cycles: 8,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xc4: {
    mnemonics: ["CPY"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xc5: {
    mnemonics: ["CMP"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xc6: {
    mnemonics: ["DEC"],
    addressingMode: "zeropage",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xc7: {
    mnemonics: ["DCP", "DCM"],
    addressingMode: "zeropage",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xc8: {
    mnemonics: ["INY"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xc9: {
    mnemonics: ["CMP"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xca: {
    mnemonics: ["DEX"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xcb: {
    mnemonics: ["SBX", "AXS", "SAX"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xcc: {
    mnemonics: ["CPY"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xcd: {
    mnemonics: ["CMP"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xce: {
    mnemonics: ["DEC"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xcf: {
    mnemonics: ["DCP", "DCM"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xd0: {
    mnemonics: ["BNE"],
    addressingMode: "relative",
    cycles: 2,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0xd1: {
    mnemonics: ["CMP"],
    addressingMode: "indirectY",
    cycles: 5,
    pageBoundaryCycle: true,
    illegal: false,
  },
  // 0xd2: { mnemonics: ["JAM", "KIL", "HLT"], illegal: true },
  0xd3: {
    mnemonics: ["DCP", "DCM"],
    addressingMode: "indirectY",
    cycles: 8,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xd4: {
    mnemonics: ["NOP"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xd5: {
    mnemonics: ["CMP"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xd6: {
    mnemonics: ["DEC"],
    addressingMode: "zeropageX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xd7: {
    mnemonics: ["DCP", "DCM"],
    addressingMode: "zeropageX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xd8: {
    mnemonics: ["CLD"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xd9: {
    mnemonics: ["CMP"],
    addressingMode: "absoluteY",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0xda: {
    mnemonics: ["NOP"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xdb: {
    mnemonics: ["DCP", "DCM"],
    addressingMode: "absoluteY",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xdc: {
    mnemonics: ["NOP"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: true,
  },
  0xdd: {
    mnemonics: ["CMP"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0xde: {
    mnemonics: ["DEC"],
    addressingMode: "absoluteX",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xdf: {
    mnemonics: ["DCP", "DCM"],
    addressingMode: "absoluteX",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xe0: {
    mnemonics: ["CPX"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xe1: {
    mnemonics: ["SBC"],
    addressingMode: "indirectX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xe2: {
    mnemonics: ["NOP"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xe3: {
    mnemonics: ["ISC", "ISB", "INS"],
    addressingMode: "indirectX",
    cycles: 8,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xe4: {
    mnemonics: ["CPX"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xe5: {
    mnemonics: ["SBC"],
    addressingMode: "zeropage",
    cycles: 3,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xe6: {
    mnemonics: ["INC"],
    addressingMode: "zeropage",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xe7: {
    mnemonics: ["ISC", "ISB", "INS"],
    addressingMode: "zeropage",
    cycles: 5,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xe8: {
    mnemonics: ["INX"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xe9: {
    mnemonics: ["SBC"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xea: {
    mnemonics: ["NOP"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xeb: {
    mnemonics: ["USBC", "SBC"],
    addressingMode: "immediate",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xec: {
    mnemonics: ["CPX"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xed: {
    mnemonics: ["SBC"],
    addressingMode: "absolute",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xee: {
    mnemonics: ["INC"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xef: {
    mnemonics: ["ISC", "ISB", "INS"],
    addressingMode: "absolute",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xf0: {
    mnemonics: ["BEQ"],
    addressingMode: "relative",
    cycles: 2,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0xf1: {
    mnemonics: ["SBC"],
    addressingMode: "indirectY",
    cycles: 5,
    pageBoundaryCycle: true,
    illegal: false,
  },
  // 0xf2: { mnemonics: ["JAM", "KIL", "HLT"], illegal: true },
  0xf3: {
    mnemonics: ["ISC", "ISB", "INS"],
    addressingMode: "indirectY",
    cycles: 8,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xf4: {
    mnemonics: ["NOP"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xf5: {
    mnemonics: ["SBC"],
    addressingMode: "zeropageX",
    cycles: 4,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xf6: {
    mnemonics: ["INC"],
    addressingMode: "zeropageX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xf7: {
    mnemonics: ["ISC", "ISB", "INS"],
    addressingMode: "zeropageX",
    cycles: 6,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xf8: {
    mnemonics: ["SED"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xf9: {
    mnemonics: ["SBC"],
    addressingMode: "absoluteY",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0xfa: {
    mnemonics: ["NOP"],
    addressingMode: "implied",
    cycles: 2,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xfb: {
    mnemonics: ["ISC", "ISB", "INS"],
    addressingMode: "absoluteY",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: true,
  },
  0xfc: {
    mnemonics: ["NOP"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: true,
  },
  0xfd: {
    mnemonics: ["SBC"],
    addressingMode: "absoluteX",
    cycles: 4,
    pageBoundaryCycle: true,
    illegal: false,
  },
  0xfe: {
    mnemonics: ["INC"],
    addressingMode: "absoluteX",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: false,
  },
  0xff: {
    mnemonics: ["ISC", "ISB", "INS"],
    addressingMode: "absoluteX",
    cycles: 7,
    pageBoundaryCycle: false,
    illegal: true,
  },
};

export default OPCODES;
