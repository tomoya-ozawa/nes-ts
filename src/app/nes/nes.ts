import CPU from "./cpu";
import RAM from "./ram";

export type Bus = {
  cpu: CPU;
  ram: RAM;
  rom: Uint8Array;
};

const NES_HEADER_SIZE = 0x10;

export default class NES {
  private bus!: Bus;

  public constructor(rom: Uint8Array) {
    this.bus = {
      rom: rom,
      ram: new RAM(),
    } as Bus;

    this.bus.cpu = new CPU(this.bus);

    const pgRomSize = 0x4000 * rom[4];
    const chRomSize = 0x2000 * rom[5];
    const pgRomStartAddress = NES_HEADER_SIZE;
    const pgRomEndAddress = NES_HEADER_SIZE + pgRomSize - 1;
    const chRomStartAddress = pgRomEndAddress + 1;
    const chRomEndAddress = chRomStartAddress + chRomSize;

    const pgrom = rom.slice(pgRomStartAddress, pgRomEndAddress);
    const chrom = rom.slice(chRomStartAddress, chRomEndAddress);
  }

  public start() {
    while (true) {
      this.bus.cpu.execute();
    }
  }
}
