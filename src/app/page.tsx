"use client";

import React, { useState, useEffect } from "react";
import NESComponent from "./NESComponent";
import GL from "./GL";
import NESROMSelect from "./NESROMSelect";

// TODO: 微妙にGLとNESComponentがわかりづらいので修正する
// 例えば、
// useGLの中でWebGLに関する処理を行い、render(Uint8Array)関数と、GLComponentを外出しする
// const [GLComponent, renderGL] = useGL();
// useNESの中でromのfetchでnes.startを行う。その際に、nes.onChange((ppu) => {render(ppu)})するとか
// const [] = useNES(renderGL);
//return (<div><GLComponent/></div>)
export default function Home() {
  const [filePath, setFilePath] = useState<string | undefined>(undefined);

  const handleSelect = (filePath: string) => {
    setFilePath(filePath);
  };

  return (
    <div>
      <GL>
        {(render) => <NESComponent nesFilePath={filePath} render={render} />}
      </GL>
      <div>
        <NESROMSelect onSelect={handleSelect} />
      </div>
    </div>
  );
}
