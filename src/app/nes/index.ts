import NES from "./nes";

const main = async (rom: Uint8Array) => {
  const nes = new NES(rom);
  nes.start();
};

export default main;
