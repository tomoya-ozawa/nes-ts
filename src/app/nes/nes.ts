import { Bit16, Bit8 } from "./bit";
import CPU from "./cpu";
import { Mapper, getMappers } from "./mappers";
import PPU from "./ppu";
import APU from "./apu";
import RAM from "./ram";
import JoyStick from "./joystick";
import { TestLogger } from "./TestLogger";

export type CpuBus = {
  read: (address: Bit8 | Bit16) => Bit8;
  write: (address: Bit8 | Bit16, data: Bit8) => void;
};

const NES_HEADER_SIZE = 0x10;

const testLogger = new TestLogger();

export default class NES {
  public display: Uint8Array = new Uint8Array();
  private cpu: CPU;
  private ram: RAM;
  private ppu: PPU;
  private apu: APU;
  private joystick: JoyStick;
  private mapper: Mapper;
  private chrom: Uint8Array;
  private onChangeHandler: (nes: this) => void = () => {};

  public constructor(private rom: Uint8Array) {
    this.ram = new RAM();
    this.cpu = new CPU(this.cpuBus(), testLogger);

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
    this.apu = new APU();
    this.joystick = new JoyStick();
  }

  public start() {
    this.cpu.reset();

    const cpuId = setInterval(() => {
      try {
        // TODO: 20 / 260 = 0.08 の時間をVBlank中の時間として設定。描画や動作がおかしくなるようであれば修正する
        const instructionsPerFrame = 1000;
        let count = 0;
        while (count < instructionsPerFrame * 0.92) {
          this.cpu.execute();
          testLogger.break();
          count++;
        }

        this.display = this.ppu.render();

        this.emitChange();

        this.ppu.setVBlank(true);

        if (this.ppu.shouldNMIOnVBlank()) {
          this.cpu.nmi();
        }

        while (count < instructionsPerFrame) {
          this.cpu.execute();
          testLogger.break();
          count++;
        }

        this.ppu.setVBlank(false);
      } catch (e) {
        clearInterval(cpuId);
        console.error(e);
        console.log(this);
      }
    }, 1000 / 60);
  }

  public onChange(handler: (nes: this) => void) {
    this.onChangeHandler = handler;
  }

  public ctrlUp(pressed: boolean) {
    this.joystick.ctrlUp(pressed);
  }

  public ctrlDown(pressed: boolean) {
    this.joystick.ctrlDown(pressed);
  }

  public ctrlLeft(pressed: boolean) {
    this.joystick.ctrlLeft(pressed);
  }

  public ctrlRight(pressed: boolean) {
    this.joystick.ctrlRight(pressed);
  }

  public ctrlA(pressed: boolean) {
    this.joystick.ctrlA(pressed);
  }

  public ctrlB(pressed: boolean) {
    this.joystick.ctrlB(pressed);
  }

  public ctrlSelect(pressed: boolean) {
    this.joystick.ctrlSelect(pressed);
  }

  public ctrlStart(pressed: boolean) {
    this.joystick.ctrlStart(pressed);
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
    if (addressValue >= 0x4000 && addressValue <= 0x4015) {
      return this.apu.read(address);
    }

    if (addressValue === 0x4016) {
      return this.joystick.read();
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

    // OAM DMA ($4014) write
    if (addressValue === 0x4014) {
      const oamData = [];
      const address = Bit16.fromBytes(new Bit8(0), data);
      for (let i = 0; i < 0xff; i++) {
        oamData.push(this.readByCPU(address));
        address.inc();
      }
      this.ppu.writeOAMData(oamData);
      return;
    }

    // $4000–$4017	$0018	NES APU and I/O registers
    if (addressValue >= 0x4000 && addressValue <= 0x4015) {
      this.apu.write(address, data);
      return;
    }

    // joystick
    if (addressValue === 0x4016) {
      this.joystick.write(data);
      return;
    }

    // https://www.nesdev.org/wiki/APU_Frame_Counter
    if (addressValue <= 0x4017) {
      this.apu.write(address, data);
      return;
    }

    throw new Error(
      `unimplemented memory map writeByCPU: ${address.toHexString()}`
    );
  }
}
