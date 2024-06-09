import NES from "./nes";

const main = (rom: Uint8Array) => {
  const nes = new NES(rom);
  nes.start();

  return {
    onChange: nes.onChange.bind(nes),
  };
};

export default main;
