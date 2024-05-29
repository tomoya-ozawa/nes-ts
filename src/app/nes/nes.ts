import CPU from "./cpu";
import RAM from "./ram";

export type Bus = {
  cpu: CPU;
  ram: RAM;
  rom: Uint8Array;
};

export default class NES {
  private bus!: Bus;

  public constructor(rom: Uint8Array) {
    this.bus = {
      rom: rom,
      ram: new RAM(),
      cpu: new CPU(this.bus),
    };

    // const pgromEnd = 0x4000 * rom[0x04];
    // const chromEnd = 0x2000 * rom[0x05];
    // const pgrom = rom.slice(0x10, pgromEnd);
    // const chrom = rom.slice(pgromEnd + 1, chromEnd);
  }

  public start() {
    setInterval(() => {
      const opcode = this.bus.rom[this.bus.cpu.getCounter()];
      this.bus.cpu.execute(opcode);
    }, 0);
  }
}
