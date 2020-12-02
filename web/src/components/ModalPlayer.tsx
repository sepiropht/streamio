import { Box, Flex } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

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
  const videoDomElement = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (
      videoDomElement &&
      !videoDomElement.current?.currentSrc.length &&
      videoUrl.length
    ) {
      const source = document.createElement("source");
      source.setAttribute("src", videoUrl);
      source.setAttribute("type", "video/mp4");
      videoDomElement.current?.appendChild(source);
    }
    if (isVisible) {
      videoDomElement?.current?.play();
    } else {
      videoDomElement?.current?.pause();
    }
  }, [isVisible]);
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
          fontSize="24px"
          margin-top="4px"
          margin-right="12px"
          name="close"
          onClick={() => close(false)}
        ></Icon>
      </Box>
      <video ref={videoDomElement} controls autoPlay loop></video>
    </Flex>
  );
};
