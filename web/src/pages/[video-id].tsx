import { Box, Link, Flex, Button, Heading } from "@chakra-ui/core";
import { useState, useEffect } from "react";
// import NextLink from "next/link";
// import { useMeQuery, useLogoutMutation } from "../generated/graphql";
// import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";
import { useVideoQuery } from "../generated/graphql";
// import { useApolloClient } from "@apollo/client";
// import { MenuHeader } from "./NavMenu";
// import { NavMenu } from "./NavMenu";
interface VideoProps {}

const Video: React.FC<VideoProps> = ({}) => {
  const router = useRouter();
  const [videoId, setVideoId] = useState("");
  useEffect(() => {
    console.log(router?.query["video-id"]);

    // get the element using the productId above then call scrollIntoView()
  });
  return (
    <Box>
      <h1>video page !{videoId}</h1>
    </Box>
  );
};

export default Video;
