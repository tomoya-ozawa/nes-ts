"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import nes from "./nes";

export default function Home() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    fetch("/sample1.nes")
      .then((response) => response.arrayBuffer())
      .then((arraybuffer) => {
        const rom = new Uint8Array(arraybuffer);
        nes(rom);
      });

    setData("start");
  }, []);

  return <p>{data ? `Your data: ${data}` : "Loading..."}</p>;
}
