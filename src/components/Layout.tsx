import React from "react";
import {StackProps, VStack} from "@chakra-ui/react";

// background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
export function Layout({children, ...rest}: StackProps) {
  return (
    <VStack backgroundColor={"#e8e5ed"}  position={"relative"} width={800} height={570} padding={"32px"} flexGrow={1} {...rest} >
      {children}
    </VStack>
  );
}
