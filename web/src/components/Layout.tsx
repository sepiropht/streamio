import React from "react";
import { Box } from "@chakra-ui/core";
import { Wrapper, WrapperVariant } from "./Wrapper";
import { NavBar } from "./NavBar";

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <Box bg="rgb(232, 232, 232)">
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </Box>
  );
};
