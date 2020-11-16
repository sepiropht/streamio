import { Box, Link, Flex, Button, Heading } from "@chakra-ui/core";
import { useState, useEffect } from "react";
// import NextLink from "next/link";
// import { useMeQuery, useLogoutMutation } from "../generated/graphql";
// import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";
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
  console.log(data);

  return Key && data ? (
    <Box>
      <video controls autoPlay loop>
        <source
          src={`http://localhost:4000/getVideo/?&key=${Key}`}
          type="video/mp4"
        ></source>
      </video>
    </Box>
  ) : loading ? (
    <h1>Wait...</h1>
  ) : error ? (
    <h1>Ta video n'as pas été trouvé</h1>
  ) : null;
};

export async function getServerSideProps({ query }) {
  const [Key, id] = [query["video-id"].slice(0, 7), query["video-id"].slice(7)];
  return { props: { Key, id } };
}

export default withApollo({ ssr: false })(Video);
