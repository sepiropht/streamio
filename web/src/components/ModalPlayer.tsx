import { Box, Flex } from "@chakra-ui/core";
import { Icon } from "@chakra-ui/core";
import { useState } from "react";

interface ModalPlayerProps {
  videoUrl: string;
  isVisible: boolean;
  close: (isVisible: boolean) => void;
}
export const ModalPlayer: React.FC<ModalPlayerProps> = ({
  isVisible,
  videoUrl,
  close,
}) => {
  const [_, setClose] = useState(isVisible);
  return (
    <Flex
      position="fixed"
      left="0"
      padding="25px"
      right="0"
      style={{ display: isVisible ? "flex" : "none" }}
      top="0"
      bottom="0"
      bg="rgba(0,0,0,.9)"
      zIndex={10000}
      flexDirection="column"
      overflow="scroll"
    >
      <Box>
        <Icon
          cursor="pointer"
          float="right"
          color="#fff"
          font-size="24px"
          margin-top="4px"
          margin-right="12px"
          name="close"
          onClick={() => close(false)}
        ></Icon>
      </Box>
      <video controls autoPlay loop>
        <source src={videoUrl} type="video/mp4"></source>
      </video>
    </Flex>
  );
};
