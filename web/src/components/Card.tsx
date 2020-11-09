import { Box, Flex, Image, Textarea, Button } from "@chakra-ui/core";
import { useState } from "react";
import NextLink from "next/link";
import { ImShare2 } from "react-icons/im";
import { ModalPlayer } from "./ModalPlayer";
interface CardProps {
  src: string;
  views: number;
  link: string;
  name: string;
  title: string;
  videoUrl: string;
}
export const Card: React.FC<CardProps> = ({
  src,
  views,
  title,
  link,
  videoUrl,
}) => {
  const [isHover, setHover] = useState(false);
  const [isVisible, showModal] = useState(false);
  return (
    <>
      <ModalPlayer
        isVisible={isVisible}
        videoUrl={videoUrl}
        close={showModal}
      ></ModalPlayer>
      <Box bg="white" border="1px solid #e8e8e8" border-radius="2px">
        <Box
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          width="100%"
          position="relative"
        >
          <Box
            className="play-button"
            onClick={() => showModal(true)}
            cursor="pointer"
            position="absolute"
            color="hsla(0,0%,100%,.9)"
            top="0"
            bottom="0"
            left="0"
            right="0"
            textAlign="center"
            fontSize="30px"
            style={{
              visibility: isHover ? "visible" : "hidden",
              filter: "drop-shadow(0 0 3px rgba(0,0,0,.8))",
            }}
            alignItems="center"
            justifyContent="center"
            display="flex"
          >
            <svg
              fill="currentColor"
              preserveAspectRatio="xMidYMid meet"
              height="1em"
              width="1em"
              viewBox="0 0 40 40"
              style={{ verticalAlign: "middle" }}
            >
              <g>
                <path d="m35.4 20.7l-29.6 16.5q-0.6 0.3-0.9 0t-0.4-0.8v-32.8q0-0.6 0.4-0.8t0.9 0l29.6 16.5q0.5 0.3 0.5 0.7t-0.5 0.7z"></path>
              </g>
            </svg>
          </Box>
          <Image
            objectFit="cover"
            minHeight="160px"
            height="120px"
            width="100%"
            src={src}
          ></Image>
        </Box>
        <Box padding="10px">
          <Textarea
            height="30px"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="transparent"
            resize="none"
            padding="2px 4px"
            paddingLeft="0"
            value={title}
            fontWeight={600}
            lineHeight={1.5}
            display="flex"
            alignItems="center"
            placeholder="Add a title"
            outline={0}
            overflow="hidden"
            minHeight="unset"
            marginBottom="7px"
          ></Textarea>
          <Flex alignItems="start" justifyContent="flex-start">
            <NextLink href="/">
              <Box color="#007bff">{link}</Box>
            </NextLink>
            <Button
              size="xs"
              bg="#748490"
              display="flex"
              justifyContent="space-around"
              color="white"
              alignSelf="center"
              marginLeft="10px"
              fontSize="10px"
              lineHeight={1.5}
              textAlign="center"
              position="relative"
              top="-5px"
              right={0}
            >
              <Box marginRight="10px" fontSize={11}>
                <ImShare2></ImShare2>
              </Box>
              Copy link
            </Button>
          </Flex>
        </Box>
      </Box>
    </>
  );
};
