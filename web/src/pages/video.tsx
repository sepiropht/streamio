//import axios from "axios";
import { useState } from "react";
import { Layout } from "../components/Layout";
import Link from "next/link";
import { useUploadVideoMutation } from "../generated/graphql";
import { Video } from "../interfaces";
import { withApollo } from "../utils/withApollo";
import s3 from "../utils/aws";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  FormControl,
  Button,
  Box,
  Flex,
  List,
  Grid,
  ListItem,
} from "@chakra-ui/core";
import { Card } from "../components/Card";

const IndexPage = () => {
  const [videos] = useState<Video[]>([]);
  const [uploadVideo] = useUploadVideoMutation();
  async function onChange(event: any) {
    uploadAws(event.target.files[0]);
    async function uploadAws(file: File) {
      const suffix = "test";
      const Bucket = `streamio/${suffix}`;
      const Key = `${uuidv4()}.${file.name.split(".").pop()}`;
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
        debugger;
        if (err) return console.log("EEEEEEEEEEEEEEEEEEEEERRR", err);
        console.log(res);
        const r = await axios.get(
          `http://localhost:4000/getVideo/?id=${data?.uploadVideo.id}&key=${Key}`
        );
        console.log(r);
      });
    }
  }
  const ListVideos = [1, 2, 3].map((_, index) => (
    <ListItem key={index}>
      <Card src={""} views={10} link={""} name={""} title="yeahhh"></Card>
    </ListItem>
  ));
  return (
    <Layout>
      <Flex bg="white" padding="10px" marginBottom="20px">
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
          height="36px"
          fontWeight="600"
          bg="#0f90fa"
          color="white"
          line-height="24px"
          font-size="16px"
          minW="172px"
          padding=" 0 35px 0 35px"
          verticalAlign="inherit"
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
          Upload Video
        </Button>
        <FormControl
          marginLeft="20px"
          fontWeight="extrabold"
          textAlign="left"
          padding="5px"
          bg="transparent"
          borderBottom="1px solid #ddd;"
          width={["100%", "100%", "100%", "100%"]}
          fontSize="16px"
        >
          <input type="text" placeholder="Paste a video Url"></input>
        </FormControl>
      </Flex>
      <Grid
        gridTemplateColumns={[
          "1fr",
          "repeat(2, 1fr)",
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
        ]}
        gap={4}
      >
        {ListVideos}
      </Grid>
    </Layout>
  );
};

export default withApollo({ ssr: false })(IndexPage);
