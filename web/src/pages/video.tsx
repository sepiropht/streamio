//import axios from "axios";
import { useState } from "react";
import { Layout } from "../components/Layout";
import Link from "next/link";
import { useUploadVideoMutation } from "../generated/graphql";
import { Video } from "../interfaces";
import { withApollo } from "../utils/withApollo";
const IndexPage = () => {
  const [videos] = useState<Video[]>([]);
  const [uploadVideo] = useUploadVideoMutation();
  async function onChange(event: any) {
    // const formData = new FormData();
    // formData.append("video", event.target.files[0]);
    // const res = await axios.post("/upload", formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // })
    const { data, errors } = await uploadVideo({
      // use the variables option so that you can pass in the file we got above
      variables: { file: event.target.files[0] },
    });
    console.log(data, errors);
  }
  const ListVideos = videos.map((video, index) => (
    <li key={index}>
      {" "}
      <Link href="/videos/[uuid]" as={`/videos/${video.uuid}`}>
        <a>
          {video.uuid}: {video.name}
        </a>
      </Link>
    </li>
  ));
  return (
    <Layout>
      <input
        type="file"
        name="file"
        placeholder="paste video url"
        onChange={onChange}
      />
      <ul>{ListVideos}</ul>
    </Layout>
  );
};

export default withApollo({ ssr: false })(IndexPage);
