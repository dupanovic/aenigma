import React from "react";
import { Button as ChakraButton } from "@chakra-ui/react";

export interface ButtonProps {
  label: string;
  onClick: () => unknown;
}

export function MyButton({ label, onClick }: ButtonProps) {
  return (
    <ChakraButton minWidth={200} onClick={onClick}>
      {label}
    </ChakraButton>
  );
}
