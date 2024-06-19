import { Bit16, Bit8 } from "./bit";
import CPU from "./cpu";
import { Mapper, getMappers } from "./mappers";
import PPU from "./ppu";
import RAM from "./ram";

export type CpuBus = {
  read: (address: Bit8 | Bit16) => Bit8;
  write: (address: Bit8 | Bit16, data: Bit8) => void;
};

const NES_HEADER_SIZE = 0x10;

export default class NES {
  public display: Uint8Array = new Uint8Array();
  private cpu: CPU;
  private ram: RAM;
  private ppu: PPU;
  private mapper: Mapper;
  private chrom: Uint8Array;
  private onChangeHandler: (nes: this) => void = () => {};

  public constructor(private rom: Uint8Array) {
    this.ram = new RAM();
    this.cpu = new CPU(this.cpuBus());

    const pgRomSize = 0x4000 * rom[4];
    const chRomSize = 0x2000 * rom[5];
    const pgRomStartAddress = NES_HEADER_SIZE;
    const pgRomEndAddress = NES_HEADER_SIZE + pgRomSize - 1;
    const chRomStartAddress = pgRomEndAddress + 1;
    const chRomEndAddress = chRomStartAddress + chRomSize;

    const Mapper = getMappers(pgRomSize);
    this.mapper = new Mapper(
      rom.slice(pgRomStartAddress, pgRomEndAddress),
      pgRomSize
    );
    this.chrom = rom.slice(chRomStartAddress, chRomEndAddress);
    this.ppu = new PPU(this.chrom);
  }

  public start() {
    this.cpu.init();
    const cpuId = setInterval(() => {
      try {
        this.cpu.execute();
        this.emitChange();
      } catch (e) {
        clearInterval(cpuId);
        console.error(e);
        console.log(this);
      }
    }, 0);

    const ppuId = setInterval(() => {
      try {
        this.display = this.ppu.render();
      } catch (e) {
        clearInterval(ppuId);
        console.error(e);
        console.log(this);
      }
    }, 60 / 1000);
  }

  public onChange(handler: (nes: this) => void) {
    this.onChangeHandler = handler;
  }

  private emitChange() {
    this.onChangeHandler(this);
  }

  private cpuBus(): CpuBus {
    return {
      read: this.readByCPU.bind(this),
      write: this.writeByCPU.bind(this),
    };
  }

  private readByCPU(address: Bit8 | Bit16): Bit8 {
    const addressValue = address.toNumber();

    // $0000–$07FF	$0800	2 KB internal RAM
    if (addressValue <= 0x07ff) {
      return this.ram.get(address);
    }

    // $0800–$0FFF	$0800	Mirrors of $0000–$07FF
    if (addressValue >= 0x0800 && addressValue <= 0x0fff) {
      return this.ram.get(address.subtract(0x8000));
    }

    // $1000–$17FF	$0800 Mirrors of $0000–$07FF
    if (addressValue >= 0x1000 && addressValue <= 0x17ff) {
      return this.ram.get(address.subtract(0x1000));
    }

    // $1800–$1FFF	$0800 Mirrors of $0000–$07FF
    if (addressValue >= 0x1800 && addressValue <= 0x1fff) {
      return this.ram.get(address.subtract(0x1800));
    }

    // $2000–$2007	$0008	NES PPU registers
    // $2008–$3FFF	$1FF8	Mirrors of $2000–$2007 (repeats every 8 bytes)
    if (addressValue >= 0x2000 && addressValue <= 0x3fff) {
      return this.ppu.read(new Bit16(0x2000 + (addressValue % 8)));
    }

    // $4000–$4017	$0018	NES APU and I/O registers
    if (addressValue >= 0x4000 && addressValue <= 0x4017) {
      // this.apu.get(address.subtract(0x4000));
      throw new Error("implement apu!");
    }

    // $4018–$401F$0008	APU and I/O functionality that is normally disabled. See CPU Test Mode.
    // $4020–$FFFF $BFE0 Unmapped. Available for cartridge use.
    // $6000–$7FFF $2000 Usually cartridge RAM, when present.
    // $8000–$FFFF $8000 Usually cartridge ROM and mapper registers.
    if (addressValue >= 0x8000 && addressValue <= 0xffff) {
      return this.mapper.read(address);
    }

    throw new Error(
      `unimplemented memory map readByCpu: ${address.toHexString()}`
    );
  }

  private writeByCPU(address: Bit8 | Bit16, data: Bit8): void {
    const addressValue = address.toNumber();

    // $0000–$07FF	$0800	2 KB internal RAM
    if (addressValue <= 0x07ff) {
      this.ram.set(address, data);
      return;
    }

    // $0800–$0FFF	$0800	Mirrors of $0000–$07FF
    if (addressValue >= 0x0800 && addressValue <= 0x0fff) {
      this.ram.set(address.subtract(0x8000), data);
      return;
    }

    // $1000–$17FF	$0800 Mirrors of $0000–$07FF
    if (addressValue >= 0x1000 && addressValue <= 0x17ff) {
      this.ram.set(address.subtract(0x1000), data);
      return;
    }

    // $1800–$1FFF	$0800 Mirrors of $0000–$07FFs
    if (addressValue >= 0x1800 && addressValue <= 0x1fff) {
      this.ram.set(address.subtract(0x1800), data);
      return;
    }

    // $2000–$2007	$0008	NES PPU registers
    // $2008–$3FFF	$1FF8	Mirrors of $2000–$2007 (repeats every 8 bytes)
    if (addressValue >= 0x2000 && addressValue <= 0x3fff) {
      const mod = addressValue % 8;
      this.ppu.write(new Bit16(0x2000 + mod), data);
      return;
    }

    // $4000–$4017	$0018	NES APU and I/O registers
    if (addressValue >= 0x4000 && addressValue <= 0x4017) {
      // this.apu.set(address.subtract(0x4000), data);
      throw new Error("implement apu!");
    }

    throw new Error(
      `unimplemented memory map writeByCPU: ${address.toHexString()}`
    );
  }
}
