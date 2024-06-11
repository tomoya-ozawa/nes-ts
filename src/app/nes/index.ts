import NES from "./nes";

const main = (rom: Uint8Array, render: (pixelData: Uint8Array) => void) => {
  const nes = new NES(rom);
  nes.start();

  nes.onChange((nes) => {
    render(nes.display);
  });
};

export default main;
