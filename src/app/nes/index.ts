import CPU from "./cpu";

const nes = async (rom: Uint8Array) => {
  const pgromEnd = 0x4000 * rom[0x04];
  const chromEnd = 0x2000 * rom[0x05];
  const pgrom = rom.slice(0x10, pgromEnd);
  const chrom = rom.slice(pgromEnd + 1, chromEnd);

  const cpu = new CPU(rom);

  // setInterval(() => {
  //   const opcode = rom[cpu.getCounter()];
  //   cpu.execute(opcode);
  // }, 0);
};

export default nes;
