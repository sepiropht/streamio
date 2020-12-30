//import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { Layout } from "../components/Layout";
import { useUploadVideoMutation } from "../generated/graphql";
import { Video } from "../interfaces";
import { withApollo } from "../utils/withApollo";
import s3 from "../utils/aws";
import { v4 as uuidv4 } from "uuid";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  FormControl,
  Button,
  Box,
  Flex,
  SimpleGrid,
  Input,
} from "@chakra-ui/react";
import useLocalStorage from "../utils/useLocalStorage";
import { Card } from "../components/Card";
import { useVideosQuery, useDeleteVideoMutation } from "../generated/graphql";
import { unionBy } from "lodash";
import { useRouter } from "next/router";
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
  useWebSocket?: boolean;
  upload?: any;
  socialUrl?: any;
}

const Home = () => {
  const router = useRouter();

  const [videoFromLocalStorage, setVideosToLocalStorage] = useLocalStorage(
    "data",
    []
  );
  const [deleteVideoMutation] = useDeleteVideoMutation();

  const urlUpload = useRef<HTMLInputElement>(null);
  const { data, error, loading, fetchMore, variables } = useVideosQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  //console.log("SERVER", data);
  const [videos, setVideo] = useState<card[]>(
    (videoFromLocalStorage || []).map((video: any) => {
      return {
        ...video,
        useWebSocket: false,
      };
    })
  );

  const [uploadVideo] = useUploadVideoMutation();
  const [pasteInputValue, setPasteInputValue] = useState("");

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function onPaste(e: any) {
    const url = e.clipboardData.getData("Text");
    setPasteInputValue("");

    fetchUrl(url);
  }
  async function fetchUrl(url: string) {
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
      const socialUrl = (ws: any) =>
        ws?.current?.send(
          JSON.stringify({
            processVideo: "",
            key: Key,
            url,
          })
        );

      setVideo([
        {
          ...data?.uploadVideo,
          useWebSocket: true,
          socialUrl,
        },
        ...videos,
      ]);

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
            useWebSocket: true,
            upload,
          },
          ...videos,
        ]);
      setVideosToLocalStorage([...videos, { ...data?.uploadVideo }]);
    }
  }
  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      const { url } = router.query;
      url && fetchUrl(url as string);
      //console.log(router.query);
    });
    return () => {
      router.events.off("routeChangeError", () => console.log("buy edit"));
    };
  }, []);

  useEffect(() => {
    setVideo(unionBy(videos, data?.videos.videos, "id"));
  }, [data?.videos.videos]);

  useEffect(() => {
    setVideosToLocalStorage(videos);
  }, [videos]);

  const { Key, start, duration } = router.query;
  useEffect(() => {
    if (start && duration) {
      console.log({ start, duration });
      const socialUrl = (ws: any) =>
        ws?.current?.send(
          JSON.stringify({
            processVideo: "",
            key: Key,
            duration: { start, duration },
          })
        );
      const newSet = videos.map((video) => {
        if (video.key === Key) {
          video.useWebSocket = true;
          video.socialUrl = socialUrl;
          return {
            ...video,
          };
        }
        return video;
      });
      console.log({ newSet });
      setVideo(newSet);
    }
  }, [start, duration]);

  const ListVideos = unionBy(videos, data?.videos.videos, "id").map(
    ({ id, title, points, key, useWebSocket, upload, socialUrl }) => {
      return (
        <Card
          id={id}
          key={key}
          Key={key}
          upload={upload}
          socialUrl={socialUrl}
          useWebSocket={useWebSocket}
          src={`${process.env.NEXT_PUBLIC_URL}${key.split(".").shift()}.jpg`}
          views={points}
          link={`/${key.slice(0, 7)}${id}`}
          videoUrl={`${process.env.NEXT_PUBLIC_URL}getVideo/?&key=${key.slice(
            0,
            7
          )}`}
          title={title}
          onDeletedCard={(currentId: number) => {
            deleteVideoMutation({ variables: { id: currentId } });
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
      <Flex bg="white" padding="10px" marginBottom="20px" alignItems="center">
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
          fontSize="16px"
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
          bg="transparent"
          width="100%"
          borderBottom="1px solid #ddd;"
          fontSize="16px"
        >
          <Input
            ref={urlUpload}
            type="text"
            value={pasteInputValue}
            onPaste={onPaste}
            border="none"
            placeholder="Paste a video Url"
          ></Input>
        </FormControl>
      </Flex>
      <SimpleGrid minChildWidth="310px" spacing="15px">
        {ListVideos}
      </SimpleGrid>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Home);
