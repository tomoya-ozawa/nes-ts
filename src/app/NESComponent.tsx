"use client";

import React, { useState, useEffect } from "react";
import nes from "./nes";

type Props = {
  render: (pixelData: Uint8Array) => void;
};

const NESComponent = ({ render }: Props) => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    fetch("/sample1.nes")
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
