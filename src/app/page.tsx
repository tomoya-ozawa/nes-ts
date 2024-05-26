"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import nes from "./nes";

export default function Home() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    nes();
    setData("start");
  }, []);

  return <p>{data ? `Your data: ${data}` : "Loading..."}</p>;
}
