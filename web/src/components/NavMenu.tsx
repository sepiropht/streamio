import { Box, Flex, Image, Textarea, Button, Spinner } from "@chakra-ui/core";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { useApolloClient } from "@apollo/client";
import { ImShare2 } from "react-icons/im";
import { ModalPlayer } from "./ModalPlayer";
import { useLogoutMutation } from "../generated/graphql";

interface NavMenuProps {
  name: string;
  activateOver?: boolean;
}
export const NavMenu: React.FC<NavMenuProps> = ({ name }) => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const [isShow, showMenu] = useState(false);
  return (
    <Box onClick={() => showMenu(isShow ? false : true)}>
      <MenuHeader name={name} activateOver={true}></MenuHeader>
      <Box
        position="absolute"
        right="16px"
        top="8px"
        bg="#fff"
        border={isShow ? "1px solid #eee" : ""}
        borderRadius="5px"
        zIndex={90}
        minWidth="180px"
        maxWidth="300px"
        boxShadow="0 0 5px rgba(0,0,0,.05)"
        userSelect="none"
        onClick={() => showMenu(isShow ? false : true)}
      >
        <Box display={isShow ? "block" : "none"}>
          <MenuHeader name={name} activateOver={false}></MenuHeader>
          <Box
            fontSize="11px"
            display={isShow ? "block" : "none"}
            padding="8px 10px 3px"
            fontWeight={600}
            borderTop="1px solid #eee"
            color="#748490"
            textAlign="left"
            lineHeight={1.5}
          >
            <Box>MY SETTINGS</Box>
            <NextLink href="/profile">
              <Box
                display="block"
                padding="7px 10px"
                color="#333"
                fontSize="14px"
                fontWeight={600}
                cursor="pointer"
                textAlign="left"
              >
                My Profile
              </Box>
            </NextLink>
            <Box></Box>
            <Box borderTop="1px solid #eee">
              <Button
                textAlign="left"
                color="black"
                onClick={async () => {
                  await logout();
                  localStorage.clear();
                  await apolloClient.resetStore();
                }}
                isLoading={logoutFetching}
                variant="ghost"
              >
                Log out
              </Button>{" "}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface MenuHeaderProps {
  name: string;
  activateOver: boolean;
}
export const MenuHeader: React.FC<MenuHeaderProps> = ({
  name,
  activateOver,
}) => {
  const [isHover, setHover] = useState(false);
  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      padding="3px 28px 3px 7px"
      borderRadius="5px"
      lineHeight="25px"
      textAlign="right"
      position="relative"
      cursor="pointer"
      color="#333"
      fontWeight={600}
      bg="transparent"
      border="1px solid transparent"
      margin="0 6px"
      style={{
        border: isHover && activateOver ? "1px solid #eee" : "",
      }}
      mr={2}
    >
      {name}
    </Box>
  );
};
