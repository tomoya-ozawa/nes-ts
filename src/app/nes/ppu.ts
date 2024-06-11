import { Bit16, Bit8 } from "./bit";
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
    ppustatus: new Bit8Register(new Bit8(0)),
    ppuaddr: new Bit16Register(new Bit16(0)),
    ppuscroll: new Bit16Register(new Bit16(0)),
    v: 0,
    t: 0,
    x: 0,
    w: 0,
  };

  constructor(private chrom: Uint8Array) {}

  public render() {
    // スプライトデータをUnit8Arrayに格納
    const sprites = new Uint8Array(256 * 240 * 4); // 256x240 ピクセル、各ピクセル4チャネル (RGBA)

    const sliced = this.chrom.slice(800, 1200);

    for (let tileIndex = 0; tileIndex < sliced.length / 16; tileIndex++) {
      for (let i = 0; i < 8; i++) {
        const byte1 = sliced[tileIndex * 16 + i];
        const byte2 = sliced[tileIndex * 16 + i + 8];

        for (let col = 0; col < 8; col++) {
          const bit1 = (byte1 >> (7 - col)) & 1;
          const bit2 = (byte2 >> (7 - col)) & 1;
          const color = (bit1 + (bit2 << 1)) * 85; // グレースケールの色値
          const offset = tileIndex * 4 * 8 + (i * 256 + col) * 4;
          sprites[offset] = color;
          sprites[offset + 1] = color;
          sprites[offset + 2] = color;
          sprites[offset + 3] = 1;
        }
      }
    }

    return sprites;
  }

  private numberToBitArray(num: number, bitLength = 8) {
    const bitArray = [];
    for (let i = bitLength - 1; i >= 0; i--) {
      bitArray.push((num >> i) & 1);
    }
    return bitArray;
  }

  public read(cpuAddress: Bit16) {
    switch (cpuAddress.toNumber()) {
      case 0x2002:
        this.getPPUSTATUS();
        break;
      case 0x2007:
        this.getPPUDATA();
        break;
      default:
        throw new Error(`invalid address!! ${cpuAddress.toHexString()}`);
    }
  }

  public write(cpuAddress: Bit16, data: Bit8) {
    switch (cpuAddress.toNumber()) {
      case 0x2000:
        this.setPPUCTRL(data);
        break;
      case 0x2001:
        this.setPPUMASK(data);
        break;
      case 0x2003:
        this.setOAMADDR(data);
        break;
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
        throw new Error(`invalid address!! ${cpuAddress.toHexString()}`);
    }
  }

  private setPPUCTRL(data: Bit8) {
    const zero = data.getNthBit(0);
    const one = data.getNthBit(1);

    if (!zero && !one) {
      this.registers.ppuctrl.mainScreen = 0;
    } else if (zero && !one) {
      this.registers.ppuctrl.mainScreen = 1;
    } else if (!zero && one) {
      this.registers.ppuctrl.mainScreen = 2;
    } else if (zero && one) {
      this.registers.ppuctrl.mainScreen = 3;
    }
    this.registers.ppuctrl.addressMode = data.getNthBit(2);
    this.registers.ppuctrl.spriteChrTable = data.getNthBit(3);
    this.registers.ppuctrl.bgChrTable = data.getNthBit(4);
    this.registers.ppuctrl.isSpriteSize8x16 = data.getNthBit(5);
    this.registers.ppuctrl.isSlave = data.getNthBit(6);
    this.registers.ppuctrl.vBlankOnNMI = data.getNthBit(7);
  }

  private setPPUMASK(data: Bit8) {
    this.registers.ppumask.grayscale = data.getNthBit(0);
    this.registers.ppumask.showBGInLeftmost8PixelsOfScreen = data.getNthBit(1);
    this.registers.ppumask.showSpritesInLeftmost8PixelsOfScreen =
      data.getNthBit(2);
    this.registers.ppumask.showBG = data.getNthBit(3);
    this.registers.ppumask.showSprite = data.getNthBit(4);
    this.registers.ppumask.emphasizeBlue = data.getNthBit(5);
    this.registers.ppumask.emphasizeGreen = data.getNthBit(6);
    this.registers.ppumask.emphasizeRed = data.getNthBit(7);
  }

  private setOAMADDR(data: Bit8) {
    throw new Error(`implement this`);
  }

  private setPPUSCROLL(data: Bit8) {
    const isFirstWrite = this.registers.w === 0;
    if (isFirstWrite) {
      const temp = Bit16.fromBytes(new Bit8(0), data);
      this.registers.ppuscroll.set(temp);
    } else {
      const ppuscroll = this.registers.ppuscroll.get().add(data);
      this.registers.ppuscroll.set(ppuscroll);
    }
  }

  private setPPUADDR(data: Bit8) {
    const isFirstWrite = this.registers.w === 0;
    if (isFirstWrite) {
      const temp = Bit16.fromBytes(new Bit8(0), data);
      this.registers.ppuaddr.set(temp);
      this.registers.w = 1;
    } else {
      const ppuaddress = this.registers.ppuaddr.get().add(data);
      this.registers.ppuaddr.set(ppuaddress);
    }
  }

  private setPPUDATA(data: Bit8) {
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

    this.registers.ppustatus.set(new Bit8(status));
  }

  private getPPUSTATUS(): Bit8 {
    this.registers.w = 0;
    return this.registers.ppustatus.get();
  }

  private getPPUDATA() {
    throw new Error("implement this!");
    // const data = this.vram.get(this.registers.ppuaddr.get());
    // this.incrementPPUADDR();
    // return data;
  }

  private incrementPPUADDR() {
    const currentAddress = this.registers.ppuaddr.get();
    const increment = this.registers.ppuctrl.addressMode === 1 ? 32 : 1;
    this.registers.ppuaddr.set(currentAddress.add(increment));
  }
}
