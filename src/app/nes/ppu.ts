import NumUtils from "./NumUtils";
import PALETTE from "./palettes";
import RAM from "./ram";
import { Bit16Register, Bit8Register } from "./registers";

type Registers = {
  ppuctrl: {
    // 7	VBlank時にNMI割込の発生	 オフ	     オン
    vBlankOnNMI: 1 | 0;
    // 6	PPUの選択	              マスター	 スレーブ
    isSlave: 1 | 0;
    // 5	スプライトサイズ	        8x8	     8x16
    isSpriteSize8x16: 1 | 0;
    // 4	BG用CHRテーブル	         $0000	  $1000
    bgChrTable: 1 | 0;
    // 3	スプライト用CHRテーブル	   $0000	  $1000
    spriteChrTable: 1 | 0;
    // 2	VRAM入出力時のアドレス変化	+1	    +32
    addressMode: 1 | 0;
    // 1-0	メインスクリーン	0=$2000 , 1=$2400 , 2=$2800 , 3=$2C00
    mainScreen: 3 | 2 | 1 | 0;
  };
  ppumask: {
    // 7	赤色を強調	オフ	オン
    emphasizeRed: 1 | 0;
    // 6	緑色を強調	オフ	オン
    emphasizeGreen: 1 | 0;
    // 5	青色を強調	オフ	オン
    emphasizeBlue: 1 | 0;
    // 4	スプライトの表示	オフ	オン
    showSprite: 1 | 0;
    // 3	BGの表示	オフ	オン
    showBG: 1 | 0;
    // 2	画面左端8ドットのスプライト	クリップ	表示
    showSpritesInLeftmost8PixelsOfScreen: 1 | 0;
    // 1	画面左端8ドットのBG	クリップ	表示
    showBGInLeftmost8PixelsOfScreen: 1 | 0;
    // 0	色設定	カラー	モノクロ
    grayscale: 1 | 0;
  };
  ppustatus: Bit8Register;
  oamaddr: Bit8Register;
  ppuaddr: Bit16Register;
  ppuscroll: Bit16Register;
  // v: During rendering, used for the scroll position. Outside of rendering, used as the current VRAM address.
  v: 1 | 0;
  // t: During rendering, specifies the starting coarse-x scroll for the next scanline and the starting y scroll for the screen. Outside of rendering, holds the scroll or VRAM address before transferring it to v.
  t: 1 | 0;
  // x: The fine-x position of the current scroll, used during rendering alongside v.
  x: 1 | 0;
  // w: Toggles on each write to either PPUSCROLL or PPUADDR, indicating whether this is the first or second write. Clears on reads of PPUSTATUS. Sometimes called the 'write latch' or 'write toggle'.
  w: 1 | 0;
};

export default class PPU {
  private vram = new RAM();
  private oam = new RAM();
  private registers: Registers = {
    ppuctrl: {
      vBlankOnNMI: 0,
      isSlave: 0,
      isSpriteSize8x16: 0,
      bgChrTable: 0,
      spriteChrTable: 0,
      addressMode: 0,
      mainScreen: 0,
    },
    ppumask: {
      emphasizeRed: 0,
      emphasizeGreen: 0,
      emphasizeBlue: 0,
      showSprite: 0,
      showBG: 0,
      showSpritesInLeftmost8PixelsOfScreen: 0,
      showBGInLeftmost8PixelsOfScreen: 0,
      grayscale: 0,
    },
    ppustatus: new Bit8Register(0),
    oamaddr: new Bit8Register(0),
    ppuaddr: new Bit16Register(0),
    ppuscroll: new Bit16Register(0),
    v: 0,
    t: 0,
    x: 0,
    w: 0,
  };

  constructor(private chrom: Uint8Array) {}

  public render() {
    // 256x240 ピクセル、各ピクセル4チャネル (RGBA)
    const display = new Uint8Array(256 * 240 * 4);
    let displayIndex = 0;

    // 描画するscanline
    for (let y = 0; y < 239; y++) {
      // 描画するpixel. 1タイル = 8pixelなので、8ごと増加する
      for (let x = 0; x < 255; x = x + 8) {
        // xとyから、対応するネームテーブルのindexを割り出す
        const nameIndex = (y >> 3) * 32 + (x >> 3) + 0x2000;
        const target = this.readPPU(nameIndex);

        const attributeTable = this.readPPU((y >> 4) * 16 + (x >> 4) + 0x23c0);
        const paletteArea = ((y >> 3) % 2 << 1) | (x >> 3) % 2;
        const paletteId =
          (NumUtils.getNthBit(attributeTable, paletteArea * 2 + 1) << 1) |
          NumUtils.getNthBit(attributeTable, paletteArea * 2);
        const palette = this.getBGPalette(paletteId);

        // スプライトの描画
        const chromAddress = target * 16 + (y % 8);
        const byte1 = this.readPPU(chromAddress);
        const byte2 = this.readPPU(chromAddress + 8);

        for (let bit = 0; bit < 8; bit++) {
          const bit1 = (byte1 >> (7 - bit)) & 1;
          const bit2 = (byte2 >> (7 - bit)) & 1;
          const paletteIndex = bit1 + (bit2 << 1);
          const palletNo = palette[paletteIndex];

          display[displayIndex] = palletNo[0];
          display[displayIndex + 1] = palletNo[1];
          display[displayIndex + 2] = palletNo[2];
          display[displayIndex + 3] = 1;
          displayIndex = displayIndex + 4;
        }
      }
    }

    // oamのレンダリング
    const sprites = this.oam.getAll();
    const renderSprite = this.registers.ppuctrl.isSpriteSize8x16
      ? this.renderSprite8x16.bind(this)
      : this.renderSprite8x8.bind(this);

    for (let i = 0; i < sprites.length; i = i + 4) {
      const positionY = sprites[i];
      const tile = sprites[i + 1];
      const attr = sprites[i + 2];
      const positionX = sprites[i + 3];

      const renderingStartIndex = (positionY * 256 + positionX) * 4;

      renderSprite(display, tile, attr, renderingStartIndex);
    }

    return display;
  }

  public readFromCPU(cpuAddress: number): number {
    switch (cpuAddress) {
      case 0x2002:
        return this.getPPUSTATUS();
      case 0x2007:
        return this.getPPUDATA();
      default:
        throw new Error(
          `invalid address!! ${NumUtils.toHexString(cpuAddress)}`
        );
    }
  }

  public writeFromCPU(cpuAddress: number, data: number) {
    switch (cpuAddress) {
      case 0x2000:
        this.setPPUCTRL(data);
        break;
      case 0x2001:
        this.setPPUMASK(data);
        break;
      case 0x2003:
        this.setOAMADDR(data);
        break;
      case 0x2004:
        this.setOAMDATA(data);
      case 0x2005:
        this.setPPUSCROLL(data);
        break;
      case 0x2006:
        this.setPPUADDR(data);
        break;
      case 0x2007:
        this.setPPUDATA(data);
        break;
      default:
        throw new Error(
          `invalid address!! ${NumUtils.toHexString(cpuAddress)}`
        );
    }
  }

  // $4014
  public writeOAMData(data: number[]) {
    data.forEach((item, index) => {
      this.oam.set(index, item);
    });
  }

  // 本来はscanlineの描画後20line分の描画時間をVBlankの時間に充てるべきだが、
  // CPUとの処理のタイミングが上手く噛み合わないため、手動でVBlankをセットする
  public setVBlank(isVBlank: boolean) {
    this.setPPUSTATUS(isVBlank, false, false, false);
  }

  // 本来はppuの中からnmiをcallすべきだが、vblankの処理をNES classで行っているため、
  // NES classがフラグを取得できるようにする
  public shouldNMIOnVBlank(): boolean {
    return !!this.registers.ppuctrl.vBlankOnNMI;
  }

  private readPPU(ppuAddress: number): number {
    // $0000-$0FFF	$1000	Pattern table 0	Cartridge
    // $1000-$1FFF	$1000	Pattern table 1	Cartridge
    // $3000-$3EFF	$0F00	Unused	Cartridge
    if (ppuAddress <= 0x1fff) {
      return this.chrom[ppuAddress];
    }

    // $2000-$23BF	$0400	Nametable 0	Cartridge
    // $2400-$27FF	$0400	Nametable 1	Cartridge
    // $2800-$2BFF	$0400	Nametable 2	Cartridge
    // $2C00-$2FFF	$0400	Nametable 3	Cartridge
    if (ppuAddress >= 0x2000 && ppuAddress <= 0x2fff) {
      return this.vram.get(ppuAddress);
    }

    // $3F00-$3F1F	$0020	Palette RAM indexes	Internal to PPU
    // $3F20-$3FFF	$00E0	Mirrors of $3F00-$3F1F	Internal to PPU
    if (ppuAddress >= 0x3f00 && ppuAddress <= 0x3fff) {
      const fixedAddress = this.fixPPUAddress(ppuAddress);
      return this.vram.get(fixedAddress);
    }

    throw new Error(`invalid ppu address ${NumUtils.toHexString(ppuAddress)}`);
  }

  private fixPPUAddress(ppuAddress: number): number {
    const mod = ppuAddress % 0x20;
    let fixedAddress = 0x3f00 + mod;
    // $3F00	Universal background color
    // $3F01-$3F03	Background palette 0
    // $3F04	Normally unused color 1
    // $3F05-$3F07	Background palette 1
    // $3F08	Normally unused color 2
    // $3F09-$3F0B	Background palette 2
    // $3F0C	Normally unused color 3
    // $3F0D-$3F0F	Background palette 3
    // $3F10	Mirror of universal background color
    // $3F11-$3F13	Sprite palette 0
    // $3F14	Mirror of unused color 1
    // $3F15-$3F17	Sprite palette 1
    // $3F18	Mirror of unused color 2
    // $3F19-$3F1B	Sprite palette 2
    // $3F1C	Mirror of unused color 3
    // $3F1D-$3F1F	Sprite palette 3
    if (fixedAddress === 0x3f10) {
      return 0x3f00;
    }
    if (fixedAddress === 0x3f14) {
      return 0x3f04;
    }
    if (fixedAddress === 0x3f18) {
      return 0x3f08;
    }
    if (fixedAddress === 0x3f1c) {
      return 0x3f0c;
    }

    return fixedAddress;
  }

  private setPPUCTRL(data: number) {
    const zero = NumUtils.getNthBit(data, 0);
    const one = NumUtils.getNthBit(data, 1);

    if (!zero && !one) {
      this.registers.ppuctrl.mainScreen = 0;
    } else if (zero && !one) {
      this.registers.ppuctrl.mainScreen = 1;
    } else if (!zero && one) {
      this.registers.ppuctrl.mainScreen = 2;
    } else if (zero && one) {
      this.registers.ppuctrl.mainScreen = 3;
    }
    this.registers.ppuctrl.addressMode = NumUtils.getNthBit(data, 2);
    this.registers.ppuctrl.spriteChrTable = NumUtils.getNthBit(data, 3);
    this.registers.ppuctrl.bgChrTable = NumUtils.getNthBit(data, 4);
    this.registers.ppuctrl.isSpriteSize8x16 = NumUtils.getNthBit(data, 5);
    this.registers.ppuctrl.isSlave = NumUtils.getNthBit(data, 6);
    this.registers.ppuctrl.vBlankOnNMI = NumUtils.getNthBit(data, 7);
  }

  private setPPUMASK(data: number) {
    this.registers.ppumask.grayscale = NumUtils.getNthBit(data, 0);
    this.registers.ppumask.showBGInLeftmost8PixelsOfScreen = NumUtils.getNthBit(
      data,
      1
    );
    this.registers.ppumask.showSpritesInLeftmost8PixelsOfScreen =
      NumUtils.getNthBit(data, 2);
    this.registers.ppumask.showBG = NumUtils.getNthBit(data, 3);
    this.registers.ppumask.showSprite = NumUtils.getNthBit(data, 4);
    this.registers.ppumask.emphasizeBlue = NumUtils.getNthBit(data, 5);
    this.registers.ppumask.emphasizeGreen = NumUtils.getNthBit(data, 6);
    this.registers.ppumask.emphasizeRed = NumUtils.getNthBit(data, 7);
  }

  private setOAMADDR(data: number) {
    this.registers.oamaddr.set(data);
  }

  private setPPUSCROLL(data: number) {
    const isFirstWrite = this.registers.w === 0;
    if (isFirstWrite) {
      const temp = NumUtils.fromBytes(0, data);
      this.registers.ppuscroll.set(temp);
    } else {
      const ppuscroll = this.registers.ppuscroll.get() + data;
      this.registers.ppuscroll.set(ppuscroll);
    }
  }

  private setPPUADDR(data: number) {
    const isFirstWrite = this.registers.w === 0;
    if (isFirstWrite) {
      const temp = NumUtils.fromBytes(0, data);
      this.registers.ppuaddr.set(temp);
      this.registers.w = 1;
    } else {
      const ppuaddress = this.registers.ppuaddr.get() + data;
      this.registers.ppuaddr.set(ppuaddress);
    }
  }

  private setPPUDATA(data: number) {
    this.registers.w = 0;
    this.vram.set(this.registers.ppuaddr.get(), data);
    this.incrementPPUADDR();
  }

  private setPPUSTATUS(
    isVBlank: boolean,
    collision0Sprite: boolean,
    paintingSpriteMoreThan9: boolean,
    unwritableVRAM: boolean
  ) {
    let status = 0;

    // 7	 スクリーンの描画状況	        描画中	VBlank中
    status = (status << 1) | Number(isVBlank);
    // 6	 描画ラインの0番スプライト	   衝突しない	衝突した
    status = (status << 1) | Number(collision0Sprite);
    // 5	 描画ラインスプライト数	      8個以下	9個以上
    status = (status << 1) | Number(paintingSpriteMoreThan9);
    // 4	 VRAM状態	                 書き込み可能	書き込み不可
    status = (status << 1) | Number(unwritableVRAM);
    // 3-0 未使用
    status = status << 4;
    this.registers.ppustatus.set(status);
  }

  private setOAMDATA(data: number) {}

  private getPPUSTATUS(): number {
    this.registers.w = 0;
    return this.registers.ppustatus.get();
  }

  private getPPUDATA() {
    this.registers.w = 0;
    const data = this.vram.get(this.registers.ppuaddr.get());
    this.incrementPPUADDR();
    return data;
  }

  private incrementPPUADDR() {
    const currentAddress = this.registers.ppuaddr.get();
    const increment = this.registers.ppuctrl.addressMode === 1 ? 32 : 1;
    this.registers.ppuaddr.set(currentAddress + increment);
  }

  private renderSprite8x8(
    display: Uint8Array,
    tile: number,
    attr: number,
    renderingStartIndex: number
  ) {
    const tableNum = this.registers.ppuctrl.spriteChrTable ? 0x1000 : 0x0000;
    const paletteId =
      (NumUtils.getNthBit(attr, 1) >> 1) | NumUtils.getNthBit(attr, 0);
    const palette = this.getPalette(paletteId);

    for (let y = 0; y < 8; y++) {
      const chromAddress = tile * 16 + tableNum + (y % 8);
      const byte1 = this.readPPU(chromAddress);
      const byte2 = this.readPPU(chromAddress + 8);

      let displayIndex = renderingStartIndex + y * 256 * 4;

      for (let bit = 0; bit < 8; bit++) {
        const bit1 = (byte1 >> (7 - bit)) & 1;
        const bit2 = (byte2 >> (7 - bit)) & 1;

        const paletteIndex = bit1 + (bit2 << 1);

        if (paletteIndex !== 0) {
          const palletNo = palette[paletteIndex];
          display[displayIndex] = palletNo[0];
          display[displayIndex + 1] = palletNo[1];
          display[displayIndex + 2] = palletNo[2];
          display[displayIndex + 3] = 1;
        }

        displayIndex = displayIndex + 4;
      }
    }
  }

  private renderSprite8x16(
    display: Uint8Array,
    tile: number,
    attr: number,
    renderingStartIndex: number
  ) {
    const tableNum = NumUtils.getNthBit(tile, 0);
    const upperTileId = (tile >> 1) * 2;
    const lowerTileId = upperTileId + 1;
    // TODO: 優先度の実装
    const priority = NumUtils.getNthBit(attr, 5);
    const paletteId =
      (NumUtils.getNthBit(attr, 1) >> 1) | NumUtils.getNthBit(attr, 0);
    const palette = this.getPalette(paletteId);

    for (let y = 0; y < 16; y++) {
      const tileId = y < 8 ? upperTileId : lowerTileId;
      const chromAddress = tileId * 16 + tableNum * 0x1000 + (y % 8);
      const byte1 = this.readPPU(chromAddress);
      const byte2 = this.readPPU(chromAddress + 8);

      let displayIndex = renderingStartIndex + y * 256 * 4;

      for (let bit = 0; bit < 8; bit++) {
        const bit1 = (byte1 >> (7 - bit)) & 1;
        const bit2 = (byte2 >> (7 - bit)) & 1;

        const paletteIndex = bit1 + (bit2 << 1);

        if (paletteIndex !== 0) {
          const palletNo = palette[paletteIndex];
          display[displayIndex] = palletNo[0];
          display[displayIndex + 1] = palletNo[1];
          display[displayIndex + 2] = palletNo[2];
          display[displayIndex + 3] = 1;
        }

        displayIndex = displayIndex + 4;
      }
    }
  }

  private getBGPalette(
    id: number
  ): [
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ] {
    const bgColor = this.readPPU(0x3f00);

    // $3F01-$3F03	Background palette 0
    if (id === 0) {
      return [
        [bgColor, bgColor, bgColor],
        PALETTE[this.readPPU(0x3f01)],
        PALETTE[this.readPPU(0x3f02)],
        PALETTE[this.readPPU(0x3f03)],
      ];
    }
    // $3F05-$3F07	Background palette 1
    if (id === 1) {
      return [
        [bgColor, bgColor, bgColor],
        PALETTE[this.readPPU(0x3f05)],
        PALETTE[this.readPPU(0x3f06)],
        PALETTE[this.readPPU(0x3f07)],
      ];
    }
    // $3F09-$3F0B	Background palette 2
    if (id === 2) {
      return [
        [bgColor, bgColor, bgColor],
        PALETTE[this.readPPU(0x3f09)],
        PALETTE[this.readPPU(0x3f0a)],
        PALETTE[this.readPPU(0x3f0b)],
      ];
    }
    // $3F0D-$3F0F	Background palette 3
    if (id === 3) {
      return [
        [bgColor, bgColor, bgColor],
        PALETTE[this.readPPU(0x3f0d)],
        PALETTE[this.readPPU(0x3f0e)],
        PALETTE[this.readPPU(0x3f0f)],
      ];
    }

    throw new Error(`invalid palette id ${id}`);
  }

  private getPalette(
    id: number
  ): [
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ] {
    const bgColor = this.readPPU(0x3f00);
    // $3F11-$3F13	Sprite palette 0
    if (id === 0) {
      return [
        [bgColor, bgColor, bgColor],
        PALETTE[this.readPPU(0x3f11)],
        PALETTE[this.readPPU(0x3f12)],
        PALETTE[this.readPPU(0x3f13)],
      ];
    }
    // $3F15-$3F17	Sprite palette 1
    if (id === 1) {
      return [
        [bgColor, bgColor, bgColor],
        PALETTE[this.readPPU(0x3f15)],
        PALETTE[this.readPPU(0x3f16)],
        PALETTE[this.readPPU(0x3f17)],
      ];
    }
    // $3F19-$3F1B	Sprite palette 2
    if (id === 2) {
      return [
        [bgColor, bgColor, bgColor],
        PALETTE[this.readPPU(0x3f19)],
        PALETTE[this.readPPU(0x3f1a)],
        PALETTE[this.readPPU(0x3f1b)],
      ];
    }
    // $3F1D-$3F1F	Sprite palette 3
    if (id === 3) {
      return [
        [bgColor, bgColor, bgColor],
        PALETTE[this.readPPU(0x3f1d)],
        PALETTE[this.readPPU(0x3f1e)],
        PALETTE[this.readPPU(0x3f1f)],
      ];
    }

    throw new Error(`invalid palette id ${id}`);
  }
}
