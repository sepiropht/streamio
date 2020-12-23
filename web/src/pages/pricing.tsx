import {
  Box,
  List,
  ListItem,
  Link,
  Flex,
  Button,
  FormControl,
  Input,
} from "@chakra-ui/react";
import NextLink from "next/link";
// import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";
import { CardPrice } from "../components/CardPrice";

const Pricing: React.FC = () => (
  <Box
    background="linear-gradient(180deg,#fff,#fff 0,#f1f1f1 60%) !important"
    fontSize="14px"
    fontWeight={400}
    lineHeight={1.5}
  >
    <Box
      paddingTop="15px"
      borderBottom="none"
      position="relative"
      padding=".5rem 1rem"
    >
      <List
        color="black"
        backgroundColor="transparent"
        display="flex"
        justifyContent="space-between"
        border="none"
        flexWrap="wrap"
        lineHeight="44px"
        flexDirection="row"
        width="100%"
      >
        <ListItem
          fontFamily="'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif"
          lineHeight="44px"
        >
          <Link
            fontSize="25px"
            fontWeight={900}
            color="#2c2c2c"
            margin="0 10px"
            transition="color .2s cubic-bezier(.4,0,.2,1)"
            href="https://streamio.io"
          >
            Streamio
          </Link>
        </ListItem>
      </List>
    </Box>

    <Box
      width="100vw"
      maxWidth="960px"
      margin=" 0 auto"
      paddingBottom="0"
      position="relative"
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
    >
      <Box
        id="features"
        width="100vw"
        margin="30px auto"
        color="#2c2c2c"
        padding="20px"
        fontSize="50px"
        display="flex"
        marginTop="50px"
        textAlign="center"
        justifyContent="center"
        fontWeight={600}
        borderBottom="1px solid #e7e7e7"
      >
        Choose your plan.
      </Box>
    </Box>
    <CardPrice></CardPrice>
  </Box>
);

export default Pricing;
