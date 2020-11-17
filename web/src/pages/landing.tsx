import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  Link,
  Flex,
  Button,
  FormControl,
  Input,
} from "@chakra-ui/core";
import { FaCloudUploadAlt } from "react-icons/fa";
import NextLink from "next/link";
// import { isServer } from "../utils/isServer";
// import { useRouter } from "next/router";
// import { useApolloClient } from "@apollo/client";
import axios from "axios";
import s3 from "../utils/aws";
import useLocalStorage from "../utils/useLocalStorage";
import { useVideosQuery } from "../generated/graphql";
import { v4 as uuidv4 } from "uuid";
import { Video } from "../interfaces";
import { useUploadVideoMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

interface LandingProps {}

const Landing: React.FC<LandingProps> = ({}) => {
  const [videoFromLocalStorage, setVideosToLocalStorage] = useLocalStorage(
    "data",
    []
  );
  const { data, error, loading, fetchMore, variables } = useVideosQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [videos, setVideo] = useState<Video[]>(videoFromLocalStorage || []);
  const [uploadVideo] = useUploadVideoMutation();

  async function onChange(event: any) {
    uploadAws(event.target.files[0]);
    async function uploadAws(file: File) {
      const suffix = "test";
      const Bucket = `streamio/${suffix}`;
      const Key = `${uuidv4()}.mp4`;
      const { data } = await uploadVideo({
        variables: {
          input: {
            title: file.name,
            Key,
            size: file.size,
          },
        },
      });
      const uploadParams = {
        Bucket,
        Key,
        Body: file,
      };

      s3.upload(uploadParams, async (err: any, res: any) => {
        if (err) return console.log("EEEEEEEEEEEEEEEEEEEEERRR", err);
        console.log(res);
        const r = await axios.get(
          `http://localhost:4000/processVideo/?id=${data?.uploadVideo.id}&key=${Key}`
        );
        console.log(r);
        // Wait the end of upload to s3 before rendering the card
        if (data) {
          setVideo([...videos, { ...data?.uploadVideo }]);
          setVideosToLocalStorage([...videos, { ...data?.uploadVideo }]);
        }
      });
    }
  }
  return (
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
          line-height="44px"
          flex-direction="row"
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
              href="https://Streamario.com"
            >
              Streamario
            </Link>
          </ListItem>
          <ListItem
            flex-direction="row"
            display="flex"
            fontWeight={400}
            lineHeight="44px"
            cursor="pointer"
            flex="1 1 0%"
          >
            <NextLink href="/features">
              <Box
                font-size="16px"
                color="#2c2c2c"
                margin="0 10px"
                transition="color .2s cubic-bezier(.4,0,.2,1)"
              >
                Features
              </Box>
            </NextLink>

            <NextLink href="pricings">
              <Box margin="0 10px">Pricings </Box>
            </NextLink>
          </ListItem>

          <ListItem
            display="flex"
            cursor="pointer"
            flexDirection="row"
            lineHeight="44px"
          >
            <NextLink href="/login">
              <Box margin="0 10px">Log In</Box>
            </NextLink>
            <NextLink href="/register">
              <Button bg="#0f90fa" color="white" margin="0 10px">
                Sign up for free
              </Button>
            </NextLink>
          </ListItem>
        </List>
      </Box>
      <Box
        minHeight="calc(100vh - 132px)"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          color="#2c2c2c"
          textAlign="center"
          maxWidth="600px"
          marginBottom="50px"
          lineHeight="1.1"
          fontSize="70px"
          fontWeight={700}
          fontFamily="'Roboto',Helvetica,sans-serif"
          paddingTop="50px"
        >
          <h1>
            Video hosting for
            <span style={{ textDecoration: "underline" }}> everyone.</span>
          </h1>
        </Box>
        <Box maxWidth="500px" color="#555" fontSize="18px" textAlign="center">
          Streamario is one of the easiest way to upload, edit, and share video
          — it's free to use and there's no signup required.
        </Box>
        <Flex
          bg="white"
          padding="30px 25px"
          marginTop="70px"
          marginBottom="90px"
        >
          <FormControl display="none" bg="white">
            <input
              className="upload-input"
              type="file"
              name="file"
              placeholder="paste video url"
              onChange={onChange}
            />
          </FormControl>
          <Button
            height="50px"
            fontWeight={600}
            bg="#0f90fa"
            color="white"
            line-height="24px"
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            font-size="16px"
            minW="172px"
            border="none"
            position="relative"
            letterSpacing="0"
            transition="background-color .2s"
            onClick={() => {
              const clickEvent = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: false,
              });
              const input = document.querySelector(".upload-input");
              input?.dispatchEvent(clickEvent);
            }}
          >
            Upload a video File
          </Button>
          <FormControl
            marginLeft="20px"
            fontWeight="extrabold"
            padding="5px"
            bg="transparent"
            width={["100%", "100%", "100%", "100%"]}
            fontSize="16px"
          >
            <Input
              variant="flushed"
              textAlign="center"
              placeholder="Paste a video URL"
            />
          </FormControl>
        </Flex>
      </Box>
    </Box>
  );
};

export default withApollo({ ssr: false })(Landing);
