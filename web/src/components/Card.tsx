import { Box, Flex, Image, Textarea, Button, Spinner } from "@chakra-ui/core";
import { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import axios from "axios";
import { ImShare2 } from "react-icons/im";
import { ModalPlayer } from "./ModalPlayer";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBinFill } from "react-icons/ri";
import { useDeleteVideoMutation } from "../generated/graphql";
interface CardProps {
  Key: string;
  src: string;
  views: number;
  link: string;
  title: string;
  videoUrl: string;
  isCardLoaded: boolean;
  id: number;
}
export const Card: React.FC<CardProps> = ({
  id,
  src,
  views,
  title,
  link,
  videoUrl,
  Key,
  isCardLoaded = true,
}) => {
  const [isHover, setHover] = useState(false);
  const [isVisible, showModal] = useState(false);
  const [isCardLoad, setCardLoader] = useState(isCardLoaded);
  const [video, setVideoUrl] = useState("");
  const imageElement = useRef<HTMLImageElement>();
  const [isMenuShow, showMenu] = useState(false);
  const [deleteVideo] = useDeleteVideoMutation();
  useEffect(() => {
    console.log({ link });
    async function pollingServer() {
      return await new Promise((resolve) => {
        const interval = setInterval(async () => {
          const { data } = await axios.get(
            `http://localhost:4000/processVideo/?key=${Key.slice(
              0,
              7
            )}&id=${id}`
          );
          if (data.isAlreadyConvert) {
            setCardLoader(true);
            setVideoUrl(videoUrl);
            if (imageElement?.current) imageElement.current.src = src;
            resolve();
            clearInterval(interval);
          }
        }, 1000);
      });
    }
    pollingServer();
  }, []);
  interface MenuCardProps {
    show: boolean;
  }
  const MenuCard: React.FC<MenuCardProps> = ({ show }) => {
    return (
      <Box
        zIndex={999999}
        backgroundColor="#fff;"
        border="1px solid rgba(0,0,0,.15)"
        borderRadius="3px"
        boxShadow="0 1px 3px rgba(0,0,0,.2)"
        marginTop="10px"
        position="absolute"
        right="-16px;"
        padding="3px"
        top="268px"
        display={show ? "flex" : "none"}
      >
        <ActionMenu
          action={() =>
            deleteVideo({
              variables: { id },
              // update: (cache) => {
              //   // Post:77
              //   cache.evict({ id: "Post:" + id });
              // },
            })
          }
          name="Delete"
        >
          <RiDeleteBinFill></RiDeleteBinFill>
        </ActionMenu>
      </Box>
    );
  };

  return (
    <>
      <ModalPlayer
        isVisible={isVisible}
        videoUrl={video}
        close={showModal}
      ></ModalPlayer>
      <Spinner
        style={{ display: isCardLoad ? "none" : "block" }}
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      >
        Still Processing the video...
      </Spinner>
      <Box
        style={{ display: isCardLoad ? "block" : "none" }}
        bg="white"
        border="1px solid #e8e8e8"
        position="relative"
        border-radius="2px"
      >
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
            ref={imageElement}
            objectFit="cover"
            minHeight="160px"
            height="120px"
            width="100%"
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
            onChange={(e: any) => console.log(e.target.text)}
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
            <NextLink href={link}>
              <Box
                cursor="pointer"
                color="#007bff"
              >{`https://streamio.com${link}`}</Box>
            </NextLink>
            <Button
              size="xs"
              bg="#748490"
              display="flex"
              justifyContent="space-between"
              color="white"
              alignSelf="center"
              marginLeft="10px"
              fontSize="10px"
              lineHeight={1.5}
              height="16px"
              textAlign="center"
              position="relative"
              top="-2px"
              right={0}
            >
              <Box marginRight="10px" fontSize={11}>
                <ImShare2></ImShare2>
              </Box>
              Copy Link
            </Button>
          </Flex>
        </Box>
        <Box
          display="flex"
          flexDirection="row-reverse"
          lineHeight="1.5"
          padding="5px"
          bg="#f9f9f9"
          borderColor="rgba(0,0,0,.05)"
        >
          <Button
            padding="0 15"
            fontWeight={600}
            borderRadius="3px"
            height="26px"
            lineHeight="24px;"
            fontSize="13px"
            variant="link"
            display="flex"
            justifyContent="space-between"
            onClick={() => showMenu(isMenuShow ? false : true)}
          >
            <Box marginRight="8px">
              <BsThreeDots></BsThreeDots>
            </Box>
            More
          </Button>
        </Box>
        <MenuCard show={isMenuShow}></MenuCard>
      </Box>
    </>
  );
};

interface ActionMenuProps {
  name: string;
  action: () => void;
}
const ActionMenu: React.FC<ActionMenuProps> = ({ name, action, children }) => (
  <Box
    position="relative"
    cursor="pointer"
    display="flex"
    fontSize="13px"
    textDecoration="none"
    color="#748490"
    whiteSpace="nowrap"
    padding="8px 12px 8px 6px"
    lineHeight="1.5em"
    onClick={action}
    alignItems="center"
    width="148px"
  >
    <Box marginRight="8px">{children}</Box>
    {name}
  </Box>
);
