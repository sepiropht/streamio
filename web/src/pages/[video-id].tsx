import { useEffect, useRef } from "react";
import { Box, Link } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
// import NextLink from "next/link";
// import { useMeQuery, useLogoutMutation } from "../generated/graphql";

import NextLink from "next/link";
import {
  useVideoQuery,
  useUpdateVideoViewsMutation,
} from "../generated/graphql";
import { withApollo } from "../utils/withApollo";
import useLocalStorage from "../utils/useLocalStorage";

interface VideoProps {
  Key: string;
  id: string;
}

const Video: React.FC<VideoProps> = ({ Key, id }) => {
  const { data, error } = useVideoQuery({
    skip: id.length === 0,
    variables: {
      id: parseInt(id, 10),
    },
  });
  const [views, setViews] = useLocalStorage("views", []);
  const [updateVideoViewsMutation] = useUpdateVideoViewsMutation();
  const videoElement = useRef<HTMLVideoElement>(null);

  if (data) {
    const { Video } = data;
    if (!views.includes(Video?.id) && Video) {
      const id = parseInt(Video.id.toString(), 10);
      (async () => {
        setViews([...views, Video.id]);
        const { errors } = await updateVideoViewsMutation({
          variables: { id },
        });
        if (!errors) {
          setViews([...views, Video?.id]);
        }
      })();
    }
    if (Video?.isConvertionPending) {
      setTimeout(() => document.location.reload(), 1000);
    }

    useEffect(() => {
      if (isMobile) {
        videoElement.current?.requestFullscreen();
      }
    }, []);

    return Key && !Video?.isConvertionPending ? (
      <Box
        minHeight="100% !important"
        margin="0 auto"
        marginBottom="-50px !important"
        maxWidth="500px"
        padding="0px"
        overflowX="hidden"
        lineHeight="1.43"
        textAlign="center"
        boxShadow="0 1px 3px black"
      >
        <Box
          maxWidth="556.444px"
          width="100%"
          display="inline-block"
          textAlign="center"
          position="relative"
        >
          <Box className="media-container">
            <Box
              width="100%"
              paddingBottom="56.25%;"
              maxWidth="376.889px;"
            ></Box>
            <Box
              position="absolute"
              top="0px;"
              left="0px"
              right="0px;"
              bottom="0px;"
              height="50px"
            >
              <video
                controls
                playsInline
                autoPlay
                loop
                muted
                poster={`${process.env.NEXT_PUBLIC_URL}${Video?.key
                  .split(".")
                  .shift()}.jpg`}
              >
                <source
                  src={`${process.env.NEXT_PUBLIC_URL}getVideo/?&key=${Key}`}
                  type="video/mp4"
                ></source>
              </video>
            </Box>
          </Box>
          <Box id="everything-but-video" bg="white" boxShadow="0 1px 2px black">
            <Box
              padding="12px 12px"
              textAlign="left"
              className="metadata"
              justifyContent="space-between"
              id="video-footer"
              font-weight="normal"
              color="#444"
              display="flex"
            >
              <Box id="title" fontWeight="bold">
                {Video?.title}{" "}
              </Box>
              <span id="visits">
                {Video?.points} {Video?.points === 1 ? "view" : "views"}
              </span>
            </Box>

            <Box
              lineHeight="0"
              textAlign="left"
              padding="8px"
              backgroundColor="#f9f9f9"
              borderTop="1px solid #eeeeee"
              className="actions-section"
            >
              <Box cursor="pointer" padding="10px" fontWeight={600}>
                <Link href="http://sepiropht.com" isExternal>
                  Sepiropht
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    ) : (
      <Box marginTop="45px" textAlign="center" alignItems="center">
        <h1>Processing video</h1>
        <p>We'll refresh this page when it's ready.</p>
      </Box>
    );
  }

  if (error) {
    return (
      <Box marginTop="45px" textAlign="center" alignItems="center">
        <h1>Oops!</h1>
        <p>We couldn't find your video, not found</p>
      </Box>
    );
  }
  return null;
};

export async function getServerSideProps({
  query,
}: {
  query: { "video-id": string };
}) {
  const [Key, id] = [query["video-id"].slice(0, 7), query["video-id"].slice(7)];
  return { props: { Key, id } };
}

export default withApollo({ ssr: false })(Video);
