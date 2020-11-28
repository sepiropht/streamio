import { Box } from "@chakra-ui/core";
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

    return Key && !Video?.isConvertionPending ? (
      <Box
        minHeight="100% !important"
        margin=""
        marginBottom="-50px !important"
        width="100%"
        padding="0px"
        overflowX="hidden"
        lineHeight="1.43"
        textAlign="center"
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
            >
              <video
                controls
                autoPlay
                loop
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
          <Box id="everything-but-video" bg="white">
            <Box className="box has-title" marginTop="50px" maxWidth="100vw">
              <Box
                padding="12px"
                textAlign="left"
                className="metadata"
                justifyContent="space-between"
                id="video-footer"
                font-weight="normal"
                color="#444"
                display="flex"
              >
                <span id="title">{Video?.title} </span>
                <span id="visits">
                  {Video?.points} {Video?.points === 1 ? "view" : "views"}
                </span>
              </Box>

              <Box
                lineHeight="0"
                textAlign="left"
                padding="12px"
                backgroundColor="#f9f9f9"
                borderTop="1px solid #eeeeee"
                className="actions-section"
              >
                <Box cursor="pointer" padding="25px" fontWeight={600}>
                  <NextLink href="/streamario.com">Streamario</NextLink>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    ) : (
      <Box>
        <h1>Processing video</h1>
        <p>We'll refresh this page when it's ready.</p>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <h1>Ta video n'as pas été trouvé</h1>
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
