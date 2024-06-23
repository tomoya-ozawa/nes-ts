import NES from "./nes";

const main = (rom: Uint8Array, render: (pixelData: Uint8Array) => void) => {
  const nes = new NES(rom);
  nes.start();

  nes.onChange((nes) => {
    render(nes.display);
  });

  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "KeyW":
        nes.ctrlUp(true);
        break;
      case "KeyS":
        nes.ctrlDown(true);
        break;
      case "KeyA":
        nes.ctrlLeft(true);
        break;
      case "KeyD":
        nes.ctrlRight(true);
        break;
      case "KeyO":
        nes.ctrlA(true);
        break;
      case "KeyK":
        nes.ctrlB(true);
        break;
      case "KeyG":
        nes.ctrlSelect(true);
        break;
      case "KeyH":
        nes.ctrlStart(true);
        break;
    }
  });

  document.addEventListener("keyup", (e) => {
    switch (e.code) {
      case "KeyW":
        nes.ctrlUp(false);
        break;
      case "KeyS":
        nes.ctrlDown(false);
        break;
      case "KeyA":
        nes.ctrlLeft(false);
        break;
      case "KeyD":
        nes.ctrlRight(false);
        break;
      case "KeyO":
        nes.ctrlA(false);
        break;
      case "KeyK":
        nes.ctrlB(false);
        break;
      case "KeyG":
        nes.ctrlSelect(false);
        break;
      case "KeyH":
        nes.ctrlStart(false);
        break;
    }
  });
};

export default main;
