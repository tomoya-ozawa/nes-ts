"use client";

import React, { useState, useEffect } from "react";
import nes from "./nes";
import nesfiles from "./nesfiles";

type Props = {
  render: (pixelData: Uint8Array) => void;
};

const NESComponent = ({ render }: Props) => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    fetch("nesrom/nes-test-roms/tutor/tutor.nes")
      // fetch("/nesrom/tkshoot/SHOOT.nes")
      // fetch("/nesrom/nes-test-roms/branch_timing_tests/1.Branch_Basics.nes")
      // fetch("/nesrom/nes-test-roms/240pee/240pee.nes")
      //fetch("/sample1.nes")
      .then((response) => response.arrayBuffer())
      .then((arraybuffer) => {
        const rom = new Uint8Array(arraybuffer);
        nes(rom, render);
      });

    setData("start");
  }, []);

  return <p>{data ? `Your data: ${data}` : "Loading..."}</p>;
};

export default NESComponent;
