//import axios from "axios";
import { useState } from "react";
import { Layout } from "../components/Layout";
import Link from "next/link";
import { useUploadVideoMutation } from "../generated/graphql";
import { Video } from "../interfaces";
import { withApollo } from "../utils/withApollo";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Button, Box, Flex, Grid } from "@chakra-ui/react";
import { NavBar } from "../components/NavBar";
import NextLink from "next/link";

const Profile = () => {
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  return (
    <>
      <NavBar></NavBar>
      <Box padding="30px">
        <Box bg="white" fontWeight={400} fontSize="35px" width="100%">
          <h1>Profile</h1>
        </Box>
        <Box fontWeight={500} color={"rgb(116, 132, 144)"}>
          Contact info, view preferences, and account overview.
        </Box>
        <Flex
          border-top="1px solid #eee"
          margin-top="30px"
          alignItems="center"
          padding-top="30px"
        >
          <Box>
            <Box>Login</Box>
            <Box>{data?.me?.username} Joined()</Box>
          </Box>
          <Box>
            <NextLink href="/forgot-password">
              <Box textAlign="center" color="#1a70b9">
                Change password
              </Box>
            </NextLink>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default withApollo({ ssr: false })(Profile);
