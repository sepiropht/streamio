//import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { Layout } from "../components/Layout";

import {} from "@chakra-ui/core";
import { withApollo } from "../utils/withApollo";
import {
  Button,
  Box,
  Flex,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/core";
import { FaPause } from "react-icons/fa";
import { useRouter } from "next/router";
import NextLink from "next/link";
const Edit = () => {
  const [isPause, tooglePause] = useState(false);
  const [leftValue, setLeft] = useState(0);
  const [rightValue, setRight] = useState(0);
  const router = useRouter();
  const videoElement = useRef<HTMLVideoElement>(null);
  const [Key, setState] = useState("");
  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      if (router.query.Key) setState(router.query.Key as string);
    });
  }, []);

  return (
    <Layout>
      <Box
        color="#748490"
        font-size="14px"
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
                    width="100%"
                    height="100%"
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      backgroundColor: "#000",
                    }}
                    preload="metadata"
                    poster={`${Key.split(".").shift()}.jpg`}
                  >
                    <source src={`/getVideo/?&key=${Key.slice(0, 7)}`} />
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
                  <Flex justifyContent="space-between">
                    <Box
                      userSelect="none"
                      padding="15px 30px"
                      width="45%"
                      margin="auto auto 5px"
                    >
                      <Slider
                        defaultValue={0}
                        onChange={(value: number) => {
                          console.log(value);
                          tooglePause(false);
                          videoElement.current
                            ? (videoElement.current.currentTime += value)
                            : "";
                        }}
                      >
                        <SliderTrack />
                        <SliderFilledTrack />
                        <SliderThumb />
                      </Slider>
                    </Box>
                    <Box
                      userSelect="none"
                      padding="15px 30px"
                      width="45%"
                      margin="auto auto 5px"
                    >
                      <Slider
                        defaultValue={0}
                        onChange={(value: number) => {
                          console.log(value);
                          tooglePause(false);
                          videoElement.current
                            ? (videoElement.current.currentTime += value)
                            : "";
                        }}
                      >
                        <SliderTrack />
                        <SliderFilledTrack />
                        <SliderThumb />
                      </Slider>
                    </Box>
                  </Flex>
                  <Box id="clip-controls-time">
                    <Box className="clip-controls-time-control">
                      <Input type="text" value={leftValue} />
                      <Button>provissoir</Button>
                    </Box>
                    <Box>to</Box>
                    <Box>
                      <Input type="text" value={rightValue} />
                      <Button>Provisoir</Button>
                    </Box>
                  </Box>
                </Box>
                <div id="clip-controls-footer">
                  <span>
                    <button id="mute">
                      <span> Sound Off</span>
                    </button>
                    <button id="crop">
                      <span> Crop</span>
                    </button>
                  </span>
                  <button>Save Changes</button>
                </div>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Edit);
