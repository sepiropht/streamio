//import axios from "axios";
import { useState, useRef, useEffect, useCallback } from "react";
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
import { useVideosQuery } from "../generated/graphql";
import { unionBy } from "lodash";
import validUrl from "valid-url";
import validateFile from "../utils/validateFile";
import Modal from "react-modal";
Modal.setAppElement("#__next");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
interface card extends Video {
  ws?: WebSocket;
  upload?: any;
}
const Home = () => {
  const [videoFromLocalStorage, setVideosToLocalStorage] = useLocalStorage(
    "data",
    []
  );
  const ws = useRef<WebSocket>();
  const urlUpload = useRef<HTMLInputElement>(null);
  const { data, error, loading, fetchMore, variables } = useVideosQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  console.log("SERVER", data);
  const [videos, setVideo] = useState<card[]>([]);
  const [uploadVideo] = useUploadVideoMutation();

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    console.log("CLOSE MODAL");
  }

  async function onPaste(e: any) {
    const url = e.clipboardData.getData("Text");
    if (!validUrl.isWebUri(url)) {
      return;
    }
    const Key = `${uuidv4()}.mp4`;
    const { data } = await uploadVideo({
      variables: {
        input: {
          title: "",
          Key,
          size: 0,
        },
      },
    });
    if (data) {
      setVideo([
        {
          ...data?.uploadVideo,
          ws: ws.current,
          progress: 0.1,
        },
        ...videos,
      ]);

      ws?.current?.send(
        JSON.stringify({
          processVideo: "",
          key: Key,
          url,
        })
      );
      setVideosToLocalStorage([...videos, { ...data?.uploadVideo }]);
    }
  }

  async function onChange(event: any) {
    uploadAws(event.target.files[0]);
    async function uploadAws(file: File) {
      const suffix = "test";
      const Bucket = `streamio/${suffix}`;
      const Key = `${uuidv4()}.mp4`;
      if (!(await validateFile(file))) {
        event.target = "";
        openModal();
        return;
      }
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

      const upload = (callback: any) => s3.upload(uploadParams, callback);

      if (data)
        setVideo([
          {
            ...data?.uploadVideo,
            ws: ws.current,
            progress: 0.1,
            upload,
          },
          ...videos,
        ]);
      setVideosToLocalStorage([...videos, { ...data?.uploadVideo }]);
    }
  }
  useEffect(() => {
    setVideo(unionBy(videos, data?.videos.videos, "id"));
  }, [data?.videos.videos]);

  useEffect(() => {
    //setVideoToRender(unionBy(videos, data?.videos.videos, "id"));
    setVideosToLocalStorage(videos);
  }, [videos]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:4000");
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");
    // ws.current.onmessage = ({ data }) => {
    //   console.log(data);
    // };

    return () => ws.current?.close();
  }, []);
  const ListVideos = unionBy(videos, data?.videos.videos, "id").map(
    ({ id, title, points, key, progress, ws, upload }) => {
      return (
        <Card
          id={id}
          progress={progress}
          key={key}
          Key={key}
          upload={upload}
          ws={ws}
          src={`http://localhost:4000/${key.split(".").shift()}.jpg`}
          views={points}
          link={`/${key.slice(0, 7)}${id}`}
          videoUrl={`http://localhost:4000/getVideo/?&key=${key.slice(0, 7)}`}
          title={title}
          onDeletedCard={(currentId: number) => {
            setVideo(videos.filter(({ id }) => currentId !== id));
          }}
          isCardLoaded={false}
        ></Card>
      );
    }
  );
  return (
    <Layout>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h1>To large or too long</h1>
        <p> This video is either too large (500MB) or too long (10min)</p>
      </Modal>
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
            ref={urlUpload}
            type="text"
            onPaste={onPaste}
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

export default withApollo({ ssr: false })(Home);
