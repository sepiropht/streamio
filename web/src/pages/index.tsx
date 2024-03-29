import { Box, Link, Flex, Button, Heading } from "@chakra-ui/react";
// import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { withApollo } from "../utils/withApollo";
import { useRouter } from "next/router";
// import { useApolloClient } from "@apollo/client";
// import { MenuHeader } from "./NavMenu";
// import { NavMenu } from "./NavMenu";
import useLocalStorage from "../utils/useLocalStorage";
export const IndexPage = ({}) => {
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const [videoFromLocalStorage] = useLocalStorage("data", []);
  const router = useRouter();
  if (data?.me && !isServer()) {
    router.push("/home", "/", { shallow: true });
  } else if (!isServer() && videoFromLocalStorage.length) {
    router.push("/home", "/", { shallow: true });
  } else if (!isServer()) {
    router.push("/landing", "/", { shallow: true });
  }
  return null;
};
export default withApollo({ ssr: false })(IndexPage);
