"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import NESComponent from "./NESComponent";
import GL from "./GL";

// TODO: 微妙にGLとNESComponentがわかりづらいので修正する
// 例えば、
// useGLの中でWebGLに関する処理を行い、render(Uint8Array)関数と、GLComponentを外出しする
// const [GLComponent, renderGL] = useGL();
// useNESの中でromのfetchでnes.startを行う。その際に、nes.onChange((ppu) => {render(ppu)})するとか
// const [] = useNES(renderGL);
//return (<div><GLComponent/></div>)
export default function Home() {
  return (
    <div>
      <GL>{(render) => <NESComponent render={render} />}</GL>
    </div>
  );
}
