import { Box, Link, Flex, Button, Heading } from "@chakra-ui/core";
import { useState, useEffect } from "react";
// import NextLink from "next/link";
// import { useMeQuery, useLogoutMutation } from "../generated/graphql";
// import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useVideoQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";
// import { useApolloClient } from "@apollo/client";
// import { MenuHeader } from "./NavMenu";
// import { NavMenu } from "./NavMenu";
interface VideoProps {
  Key: string;
  id: string;
}

const Video: React.FC<VideoProps> = ({ Key, id }) => {
  const { data, loading, error } = useVideoQuery({
    skip: id.length === 0,
    variables: {
      id: parseInt(id, 10),
    },
  });
  console.log(data, error);

  return Key && data ? (
    <Box
      minHeight="100% !important"
      margin=""
      marginBottom="-50px !important"
      width="100%"
      padding="0px"
      overflowX="hidden"
      lineHeight="1.43"
      textAlign="center"
    >
      <Box
        maxWidth="556.444px"
        width="100%"
        display="inline-block"
        textAlign="center"
        position="relative"
      >
        <Box className="media-container">
          <Box width="100%" paddingBottom="56.25%;" maxWidth="376.889px;"></Box>
          <Box
            position="absolute"
            top="0px;"
            left="0px"
            right="0px;"
            bottom="0px;"
          >
            <video controls autoPlay loop>
              <source
                src={`http://localhost:4000/getVideo/?&key=${Key}`}
                type="video/mp4"
              ></source>
            </video>
          </Box>
        </Box>
        <Box id="everything-but-video" bg="white">
          <Box className="box has-title" marginTop="0px" maxWidth="100vw">
            <Box
              padding="12px"
              textAlign="left"
              className="metadata"
              justifyContent="space-between"
              id="video-footer"
              font-weight="normal"
              color="#444"
              display="flex"
            >
              <span id="title">{data.Video?.title} </span>
              <span id="visits">{data.Video?.points} views</span>
            </Box>

            <Box
              lineHeight="0"
              textAlign="left"
              padding="12px"
              backgroundColor="#f9f9f9"
              borderTop="1px solid #eeeeee"
              className="actions-section"
            >
              <Box cursor="pointer" padding="25px" fontWeight={600}>
                <NextLink href="/streamario.com">Streamario</NextLink>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  ) : loading ? (
    <h1>Wait...</h1>
  ) : error ? (
    <h1>Ta video n'as pas été trouvé</h1>
  ) : null;
};

export async function getServerSideProps({
  query,
}: {
  query: { "video-id": string };
}) {
  const [Key, id] = [query["video-id"].slice(0, 7), query["video-id"].slice(7)];
  return { props: { Key, id } };
}

export default withApollo({ ssr: false })(Video);
