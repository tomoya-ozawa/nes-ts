export type Mapper = {
  read: (address: number) => number;
};

export const getMappers = (pgRomSize: number) => {
  // PRG ROM size: 16 KiB for NROM-128, 32 KiB for NROM-256 (DIP-28 standard pinout)
  // PRG ROM bank size: Not bankswitched
  // PRG RAM: 2 or 4 KiB, not bankswitched, only in Family Basic (but most emulators provide 8)
  // CHR capacity: 8 KiB ROM (DIP-28 standard pinout) but most emulators support RAM
  // CHR bank size: Not bankswitched, see CNROM
  // Nametable mirroring: Solder pads select vertical or horizontal mirroring
  // Subject to bus conflicts: Yes, but irrelevant
  if (pgRomSize < 0x4001) {
    return NROMMapper128;
  }

  return NROMMapper256;
};

class NROMMapper128 {
  public constructor(private pgrom: Uint8Array, pgRomSize: number) {}

  public read(address: number) {
    const fixedAddress = (address - 0x8000) % 0x4000;
    return this.pgrom[fixedAddress];
  }
}

class NROMMapper256 {
  public constructor(private pgrom: Uint8Array, pgRomSize: number) {}

  public read(address: number) {
    return this.pgrom[address - 0x8000];
  }
}
