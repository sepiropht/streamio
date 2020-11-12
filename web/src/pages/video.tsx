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
import { FaCloudUploadAlt } from "react-icons/fa";
import { FormControl, Button, Box, Flex, Grid } from "@chakra-ui/core";
import useLocalStorage from "../utils/useLocalStorage";
import { Card } from "../components/Card";

const IndexPage = () => {
  const [videoFromLocalStorage, setVideosToLocalStorage] = useLocalStorage(
    "data",
    []
  );
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
      if (data) {
        setVideo([...videos, { ...data?.uploadVideo }]);
        setVideosToLocalStorage([...videos, { ...data?.uploadVideo }]);
      }
      s3.upload(uploadParams, async (err: any, res: any) => {
        if (err) return console.log("EEEEEEEEEEEEEEEEEEEEERRR", err);
        console.log(res);
        const r = await axios.get(
          `http://localhost:4000/processVideo/?id=${data?.uploadVideo.id}&key=${Key}`
        );
        console.log(r);
      });
    }
  }
  console.log(videos);
  const ListVideos = videos.map(({ id, title, points, key }) => {
    console.log(key);
    return (
      <Card
        id={id}
        Key={key}
        src={`http://localhost:4000/${key.split(".").shift()}.jpg`}
        views={points}
        link={`http:///localhost:4000/${key}`}
        videoUrl={`http://localhost:4000/getVideo/?id=${id}&key=${key}`}
        title={title}
        isCardLoaded={false}
      ></Card>
    );
  });
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
          <Box verticalAlign="center" fontSize={23}>
            <FaCloudUploadAlt></FaCloudUploadAlt>
          </Box>
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
          <input
            type="text"
            style={{ width: "100%" }}
            placeholder="Paste a video Url"
          ></input>
        </FormControl>
      </Flex>
      <Grid
        gridTemplateColumns={[
          "1fr",
          "repeat(2, 1fr)",
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
        ]}
        gap={5}
      >
        {ListVideos}
      </Grid>
    </Layout>
  );
};

export default withApollo({ ssr: false })(IndexPage);
