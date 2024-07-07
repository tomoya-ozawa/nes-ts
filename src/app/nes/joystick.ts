import NumUtils from "./NumUtils";
import { Bit8Register } from "./registers";

export default class JoyStick {
  private keyCounter = 0;
  private keyStatus = {
    up: false,
    down: false,
    left: false,
    right: false,
    a: false,
    b: false,
    select: false,
    start: false,
  };
  private register = new Bit8Register(0);

  public write(data: number) {
    this.register.set(data);
    if (NumUtils.getNthBit(data, 1)) {
      this.keyCounter = 0;
    }
  }

  public read() {
    const keyPressed = this.getKeyStatus() ? 1 : 0;
    this.incKeyCounter();
    const value = this.register.get() | keyPressed;
    return value;
  }

  public ctrlUp(pressed: boolean) {
    this.keyStatus.up = pressed;
  }

  public ctrlDown(pressed: boolean) {
    this.keyStatus.down = pressed;
  }

  public ctrlLeft(pressed: boolean) {
    this.keyStatus.left = pressed;
  }

  public ctrlRight(pressed: boolean) {
    this.keyStatus.right = pressed;
  }

  public ctrlA(pressed: boolean) {
    this.keyStatus.a = pressed;
  }

  public ctrlB(pressed: boolean) {
    this.keyStatus.b = pressed;
  }

  public ctrlSelect(pressed: boolean) {
    this.keyStatus.select = pressed;
  }

  public ctrlStart(pressed: boolean) {
    this.keyStatus.start = pressed;
  }

  private getKeyStatus() {
    switch (this.keyCounter) {
      case 0:
        return this.keyStatus.a;
      case 1:
        return this.keyStatus.b;
      case 2:
        return this.keyStatus.select;
      case 3:
        return this.keyStatus.start;
      case 4:
        return this.keyStatus.up;
      case 5:
        return this.keyStatus.down;
      case 6:
        return this.keyStatus.left;
      case 7:
        return this.keyStatus.right;
    }
  }

  private incKeyCounter() {
    if (this.keyCounter === 7) {
      this.keyCounter = 0;
      return;
    }
    this.keyCounter++;
  }
}
