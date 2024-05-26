import CPU from "./cpu";

const nes = async () => {
  const response = await fetch("/sample1.nes");
  const arraybuffer = await response.arrayBuffer();
  const rom = new Uint8Array(arraybuffer);

  const cpu = new CPU();

  setInterval(() => {
    const opcode = rom[cpu.getCounter()];
    cpu.execute(opcode);
  }, 0);
};

export default nes;
