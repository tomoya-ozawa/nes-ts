import React, { ChangeEvent, useEffect, useState } from "react";
import nesfiles from "./nesfiles";

type Props = {
  onSelect: (filePath: string) => void;
};

const NESROMSelect: React.FC<Props> = ({ onSelect }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const selectRom = (filePath: string) => {
    setSelectedOption(filePath);
    onSelect(filePath);
  };

  useEffect(() => {
    const storedValue = localStorage.getItem("selectedOption");
    if (storedValue) {
      selectRom(storedValue);
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    localStorage.setItem("selectedOption", value);
    selectRom(value);
  };

  return (
    <select value={selectedOption} onChange={handleChange}>
      <option value="" disabled>
        Select an option
      </option>
      {nesfiles.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default NESROMSelect;
