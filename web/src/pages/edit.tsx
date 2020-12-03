//import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";
import { Button, Box, Flex, Icon, Input } from "@chakra-ui/react";
import { AiFillSound } from "react-icons/ai";
import { FaPause } from "react-icons/fa";
import { useRouter } from "next/router";
import { Slider } from "antd";
import NextLink from "next/link";

const Edit = () => {
  const [isPause, tooglePause] = useState(false);
  const router = useRouter();
  const videoElement = useRef<HTMLVideoElement>(null);
  const [Key, setState] = useState("");
  const [durationVideo, setDurationVideo] = useState(0);
  const [range, setVideoRange] = useState<[number, number]>([0, 0]);
  const [leftTime, setLeftTime] = useState<string>("00:00:00");
  const [rightTime, setRightTime] = useState<string>("00:00:00");

  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      if (router.query.Key) setState(router.query.Key as string);
    });
    return () => {
      router.events.off("routeChangeError", () => console.log("buy edit"));
    };
  }, []);

  useEffect(() => {
    document.querySelector("video")?.addEventListener("loadeddata", () => {
      const duration = videoElement?.current?.duration || 1;
      setDurationVideo(duration);
      setRightTime(display(duration));
    });
    return document
      .querySelector("video")
      ?.removeEventListener("loadeddata", () => console.log("bye video"));
  }, []);
  return (
    <Layout>
      <Box
        color="#748490"
        fontSize="14px"
        //bg="#f1f1f1"
        flex="1 1"
        margin="0 auto"
        width="100%"
        position="relative"
      >
        <Box padding="10px" maxWidth="560px" margin="10px auto">
          <Box
            color="#aaa"
            textDecoration="none"
            display="inline-block"
            marginBottom="10px;"
          >
            <NextLink href="/home">
              <a href="">Back</a>
            </NextLink>
            <Box>
              <Box
                margin="0"
                //style={{backgroundClip: "padding-box}}
                position="relative"
                bg="#fff"
                border="1px solid #e8e8e8"
                border-radius="2px"
              >
                <Box
                  onClick={() => {
                    if (isPause) {
                      tooglePause(false);
                      videoElement.current?.play();
                    } else {
                      tooglePause(true);
                      videoElement.current?.pause();
                    }
                  }}
                  position="relative"
                  lineHeight="0"
                >
                  <Box
                    position="absolute"
                    left="0"
                    bottom="0"
                    fontSize="15px"
                    zIndex={99999999999999999}
                    color="#fff"
                    padding="5px"
                    cursor="pointer"
                    display={isPause ? "block" : "none"}
                    style={{
                      filter:
                        "drop-shadow(0 0 10px rgba(0,0,0,.5)) opacity(.7)",
                    }}
                    aria-label="pause video"
                  >
                    <FaPause></FaPause>
                  </Box>
                  <video
                    ref={videoElement}
                    playsInline
                    autoPlay
                    loop
                    muted
                    width="100%"
                    height="100%"
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      backgroundColor: "#000",
                    }}
                    preload="metadata"
                    poster={`${process.env.NEXT_PUBLIC_URL}${Key.split(
                      "."
                    ).shift()}.jpg`}
                  >
                    <source
                      src={`${
                        process.env.NEXT_PUBLIC_URL
                      }getVideo/?&key=${Key.slice(0, 7)}`}
                    />
                  </video>
                </Box>
              </Box>
              <Box
                //style={{backgroundClip: "padding-box}}
                position="relative"
                bg="#fff"
                border="1px solid #e8e8e8"
                border-radius="2px"
                margin="10px 0"
              >
                <Box>
                  <Flex padding="0 20px">
                    <Slider
                      style={{ width: "100%" }}
                      range={true}
                      onChange={(value: [number, number]) => {
                        const [left] = range;
                        const [newLeft, newRight] = value;
                        console.log({ left, newLeft, durationVideo });
                        if (left !== newLeft && videoElement.current) {
                          setLeftTime(display((newLeft * durationVideo) / 100));
                          videoElement.current.currentTime =
                            (newLeft * durationVideo) / 100;
                        } else {
                          setRightTime(
                            display((newRight * durationVideo) / 100)
                          );
                        }
                        setVideoRange(value);
                      }}
                      defaultValue={[0, 100]}
                    ></Slider>
                  </Flex>
                  <Flex justifyContent="space-around">
                    <Input
                      type="text"
                      value={leftTime}
                      disabled={true}
                      width="20%"
                    ></Input>
                    <Input type="text" value={rightTime} width="20%"></Input>
                  </Flex>
                </Box>
                <Flex
                  id="clip-controls-footer"
                  padding="15px"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box cursor="pointer" id="mute">
                    <Box
                      onClick={() =>
                        videoElement.current
                          ? (videoElement.current.muted = !videoElement.current
                              .muted)
                          : ""
                      }
                    >
                      {" "}
                      <Icon as={AiFillSound}></Icon> Sound Off
                    </Box>
                  </Box>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => {
                      const start = (range[0] * durationVideo) / 100;
                      const end = (range[1] * durationVideo) / 100;
                      const duration = end - start;
                      const params = { start, duration, Key };
                      //console.log(params);
                      router.push({ pathname: "/home", query: { ...params } });
                    }}
                  >
                    Save Changes
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Edit);

function display(seconds: number): string {
  const format = (val: number) => `0${Math.floor(val)}`.slice(-2);
  const hours = seconds / 3600;
  const minutes = (seconds % 3600) / 60;

  return [hours, minutes, seconds % 60].map(format).join(":");
}
