//import React, { useEffect } from "react";
import './Button.css';

interface ButtonProps {
    margin: string;
    border: string;
    color: string;
    children?: React.ReactNode;
    height: string;
    onClick: () => void;
    width: string;
}

// export default function Button({ text, color) {
//     return (
//         <button style={{color: color}}>{text}</button>;
//     );
// }
const Button: React.FC<ButtonProps> = ({ 
    margin,
    border,
    color,
    children,
    height,
    onClick, 
    width
  }) => { 
  return (
    <button 
      onClick={onClick}
      style={{
         margin,
         backgroundColor: color,
         border,
         height,
         width
      }}
    >
    {children}
    </button>
  );
}

export default Button;