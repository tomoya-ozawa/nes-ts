// const OPCODES = {
//   0x78: {
//     instruction:
//   }
// };

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
    pc: 0,
    stackPointer: 0,
    status: 0,
  };

  public execute(opcode: number) {
    console.log(opcode);
    switch (opcode) {
      case 0x78:
        console.log("hello");
        this.registers.pc++;
        break;
      default:
        this.registers.pc++;
    }
  }

  public getCounter() {
    return this.registers.pc;
  }
}
