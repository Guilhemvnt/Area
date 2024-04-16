import React, { useState } from "react";
import styles from "./DropdownMenu.module.css";

interface DropdownMenuProps {
  buttonText: string;
  options: string[];
  onOptionClick: (option: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  buttonText,
  options,
  onOptionClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdown}>
      <button onClick={toggleDropdown}>{buttonText}</button>
      {isOpen && (
        <ul>
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                onOptionClick(option);
                setIsOpen(false); // Ferme le menu déroulant après avoir sélectionné une option
              }}
            >
              {option}
            </button>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
