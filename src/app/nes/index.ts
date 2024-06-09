import NES from "./nes";

const main = (rom: Uint8Array, render: (pixelData: Uint8Array) => void) => {
  const nes = new NES(rom);
  nes.start();

  nes.onChange(() => {
    const pixelData = new Uint8Array(256 * 240 * 4); // 256x240 ピクセル、各ピクセル4チャネル (RGBA)
    // ここに各ピクセルの色データを設定します
    for (let y = 0; y < 240; y++) {
      for (let x = 0; x < 256; x++) {
        const offset = (y * 256 + x) * 4;
        pixelData[offset] = (x % 256) * Math.random(); // 赤
        pixelData[offset + 1] = y % 256; // 緑
        pixelData[offset + 2] = 0; // 青
        pixelData[offset + 3] = 255; // アルファ
      }
    }

    render(pixelData);
  });
};

export default main;
