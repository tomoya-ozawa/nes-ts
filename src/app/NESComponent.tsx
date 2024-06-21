"use client";

import React, { useState, useEffect } from "react";
import nes from "./nes";

type Props = {
  render: (pixelData: Uint8Array) => void;
  nesFilePath?: string;
};

const NESComponent = ({ nesFilePath, render }: Props) => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    if (!nesFilePath) return;

    fetch(nesFilePath)
      .then((response) => response.arrayBuffer())
      .then((arraybuffer) => {
        const rom = new Uint8Array(arraybuffer);
        nes(rom, render);
      });

    setData("start");
  }, [nesFilePath]);

  return <p>{data ? `Your data: ${data}` : "Loading..."}</p>;
};

export default NESComponent;
