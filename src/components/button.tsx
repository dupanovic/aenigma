import React from "react";
export interface ButtonProps {
  label: string;
  onClick: () => unknown;
}
export function Button({label, onClick}: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
