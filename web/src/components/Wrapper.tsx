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
      bg="rgb(232, 232, 232)"
      maxW={variant === "regular" ? "800px" : "initial"}
      w="100%"
    >
      {children}
    </Box>
  );
};
