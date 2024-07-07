import NumUtils from "./NumUtils";
import { Bit8Register } from "./registers";

type Registers = {
  pulse1: {
    // $4000	DDLC NNNN	Duty, loop envelope/disable length counter, constant volume, envelope period/volume
    r1: Bit8Register;
    // $4001	EPPP NSSS	Sweep unit: enabled, period, negative, shift count
    r2: Bit8Register;
    // $4002	LLLL LLLL	Timer low
    r3: Bit8Register;
    // $4003	LLLL LHHH	Length counter load, timer high (also resets duty and starts envelope)
    r4: Bit8Register;
  };
  pulse2: {
    // $4004	DDLC NNNN	Duty, loop envelope/disable length counter, constant volume, envelope period/volume
    r1: Bit8Register;
    // $4005	EPPP NSSS	Sweep unit: enabled, period, negative, shift count
    r2: Bit8Register;
    // $4006	LLLL LLLL	Timer low
    r3: Bit8Register;
    // $4007	LLLL LHHH	Length counter load, timer high (also resets duty and starts envelope)
    r4: Bit8Register;
  };
  tri: {
    // $4008	CRRR RRRR	Length counter disable/linear counter control, linear counter reload value
    r1: Bit8Register;
    // $400A	LLLL LLLL	Timer low
    r2: Bit8Register;
    // $400B	LLLL LHHH	Length counter load, timer high (also reloads linear counter)
    r3: Bit8Register;
  };
  noise: {
    // $400C	--LC NNNN	Loop envelope/disable length counter, constant volume, envelope period/volume
    r1: Bit8Register;
    // $400E	L--- PPPP	Loop noise, noise period
    r2: Bit8Register;
    // $400F	LLLL L---	Length counter load (also starts envelope)
    r3: Bit8Register;
  };
  dmc: {
    // $4010	IL-- FFFF	IRQ enable, loop sample, frequency index
    r1: Bit8Register;
    // $4011	-DDD DDDD	Direct load
    r2: Bit8Register;
    // $4012	AAAA AAAA	Sample address %11AAAAAA.AA000000
    r3: Bit8Register;
    // $4013	LLLL LLLL	Sample length %0000LLLL.LLLL0001
    r4: Bit8Register;
    // $4015	---D NT21	Control: DMC enable, length counter enables: noise, triangle, pulse 2, pulse 1 (write)
    r5: Bit8Register;
    // $4017	SD-- ----	Frame counter: 5-frame sequence, disable frame interrupt (write)
    r6: Bit8Register;
  };
  frameCounter: Bit8Register;
};

export default class APU {
  private registers: Registers = {
    pulse1: {
      r1: new Bit8Register(0),
      r2: new Bit8Register(0),
      r3: new Bit8Register(0),
      r4: new Bit8Register(0),
    },
    pulse2: {
      r1: new Bit8Register(0),
      r2: new Bit8Register(0),
      r3: new Bit8Register(0),
      r4: new Bit8Register(0),
    },
    tri: {
      r1: new Bit8Register(0),
      r2: new Bit8Register(0),
      r3: new Bit8Register(0),
    },
    noise: {
      r1: new Bit8Register(0),
      r2: new Bit8Register(0),
      r3: new Bit8Register(0),
    },
    dmc: {
      r1: new Bit8Register(0),
      r2: new Bit8Register(0),
      r3: new Bit8Register(0),
      r4: new Bit8Register(0),
      r5: new Bit8Register(0),
      r6: new Bit8Register(0),
    },
    frameCounter: new Bit8Register(0),
  };

  constructor() {}

  public read(cpuAddress: number): number {
    switch (cpuAddress) {
      default:
        console.error(
          `invalid address!! ${NumUtils.toHexString(
            cpuAddress
          )}!! implement apu`
        );
        return 0;
      // throw new Error(`invalid address!! ${cpuAddress.toHexString()}`);
    }
  }

  public write(cpuAddress: number, data: number) {
    switch (cpuAddress) {
      case 0x4000:
        this.registers.pulse1.r1.set(data);
        break;
      case 0x4001:
        this.registers.pulse1.r2.set(data);
        break;
      case 0x4002:
        this.registers.pulse1.r3.set(data);
        break;
      case 0x4003:
        this.registers.pulse1.r4.set(data);
        break;
      case 0x4004:
        this.registers.pulse2.r1.set(data);
        break;
      case 0x4005:
        this.registers.pulse2.r2.set(data);
        break;
      case 0x4006:
        this.registers.pulse2.r3.set(data);
        break;
      case 0x4007:
        this.registers.pulse2.r4.set(data);
        break;
      case 0x4008:
        this.registers.tri.r1.set(data);
        break;
      case 0x400a:
        this.registers.tri.r2.set(data);
        break;
      case 0x400b:
        this.registers.tri.r3.set(data);
        break;
      case 0x400c:
        this.registers.noise.r1.set(data);
        break;
      case 0x400e:
        this.registers.noise.r2.set(data);
        break;
      case 0x400f:
        this.registers.noise.r3.set(data);
        break;
      case 0x4010:
        this.registers.dmc.r1.set(data);
        break;
      case 0x4011:
        this.registers.dmc.r2.set(data);
        break;
      case 0x4012:
        this.registers.dmc.r3.set(data);
        break;
      case 0x4013:
        this.registers.dmc.r4.set(data);
        break;
      case 0x4015:
        this.registers.dmc.r5.set(data);
        break;
      case 0x4017:
        this.registers.frameCounter.set(data);
        break;

      default:
        throw new Error(
          `invalid address!! ${NumUtils.toHexString(cpuAddress)}`
        );
    }
  }
}
