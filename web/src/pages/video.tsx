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
  let Data;
  const [videos, setVideo] = useState<any[]>([]);
  const [uploadVideo] = useUploadVideoMutation();
  let key;
  async function onChange(event: any) {
    uploadAws(event.target.files[0]);
    async function uploadAws(file: File) {
      const suffix = "test";
      const Bucket = `streamio/${suffix}`;
      const Key = `${uuidv4()}.${file.name.split(".").pop()}`;
      key = Key;
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
        Data = data;
        setVideo([...videos, { ...data?.uploadVideo }]);
      }
      s3.upload(uploadParams, async (err: any, res: any) => {
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
    <Card
      key={index}
      src={
        "https://cdn-cf-east.streamable.com/image/qzpehe.jpg?Expires=1604878380&Signature=kBqTh6VhDTvqdOBxWUOh0Can8JoGRkT1prg-9fo4zp0FOScNSzI2kB-tYXvwlwCNBSEAawQ99Es~3X3IdwBJZXs49NynNF198O66j1zUJBznOt12Cf-VTKl0fdp9ZMSq3T3Pqn6RaFbe1JwqU2AqMhAC2d577iqGj1qw18syO4VofN2zJj~qch6Ljjw9mq~Wvvfw1JZTNr6212jNbwgykdpgA5FoVH-c8~~FQl3EBEYz2h1WW0CwDaymYSlnR12aH9X8Q96cG17A3oQUWIOkcoQmep6fL6MBQZd0UozwnNtAzsoRYyZ8OgN~L~kbzb3YuoUUGaGx4m1CK~DAj-1sXA__&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ"
      }
      views={10}
      link="https://streamio/douazbdjabzda"
      name={""}
      videoUrl={`http://localhost:4000/getVideo/?id=69&key=7c12ffd6-c3c4-4add-8a77-63aaa4d238e3.mp4`}
      title="20191226_ferme"
    ></Card>
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
