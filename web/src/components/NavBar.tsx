import { useState } from "react";
import { Box, Link, Flex, Button, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";
import { MenuHeader } from "./NavMenu";
import { NavMenu } from "./NavMenu";
interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [isHover, setHover] = useState(false);
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  let body = null;

  // data is loading
  if (loading) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Button
            as={Link}
            bg="rgb(237, 255, 244)"
            borderColor="rgba(25, 150, 98, 0.26)"
            borderStyle="solide"
            borderRadius="3px"
            borderWidth="1px"
            size="sm"
            color="rgb(18, 119, 18)"
            boxShadow="0 2px 2px rgba(15,148,33,.1)"
            mr={4}
          >
            Upgrade
          </Button>
        </NextLink>

        <NextLink href="/register">
          <Button as={Link} bg="#0f90fa" color="white" size="sm">
            Sign Up
          </Button>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex alignItems="center">
        <NextLink href="/create-post">
          <Button
            as={Link}
            bg="rgb(237, 255, 244)"
            borderColor="rgba(25, 150, 98, 0.26)"
            borderStyle="solide"
            borderRadius="3px"
            borderWidth="1px"
            variant="ghost"
            size="sm"
            color="rgb(18, 119, 18)"
            boxShadow="0 2px 2px rgba(15,148,33,.1)"
            mr={4}
          >
            Upgrade
          </Button>
        </NextLink>
        <NavMenu name={data.me.username}></NavMenu>
        {/* <Button
        onClick={async () => {
          await logout();
          await apolloClient.resetStore();
        }}
        isLoading={logoutFetching}
        variant="link"
      >
        logout
      </Button> */}
      </Flex>
    );
  }

  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      fontSize="16px"
      bg="rgb(255, 255, 255)"
      borderBottom="rgb(232, 232, 232)"
      borderBottomWidth="1px"
      lineHeight="24px"
      borderStyle="solid"
      pr={10}
      padding="7px"
    >
      <Flex flex={1} m="auto" justifyContent="space-between">
        <NextLink href="/">
          <Link>
            <Heading>Streamio</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
