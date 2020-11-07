import React from "react";
import { Box } from "@chakra-ui/core";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      padding="10px"
      maxW={variant === "regular" ? "926px" : "initial"}
      w="100%"
    >
      {children}
    </Box>
  );
};
