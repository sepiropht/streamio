//import axios from "axios";
import { useState } from "react";
import { Layout } from "../components/Layout";
import Link from "next/link";
import { useUploadVideoMutation } from "../generated/graphql";
import { Video } from "../interfaces";
import { withApollo } from "../utils/withApollo";
import s3 from "../utils/aws";
import { v4 as uuidv4 } from "uuid";

const IndexPage = () => {
  const [videos] = useState<Video[]>([]);
  const [uploadVideo] = useUploadVideoMutation();
  async function onChange(event: any) {
    uploadAws(event.target.files[0]);
    function uploadAws(file: File) {
      const suffix = "test";
      const Bucket = `streamio/${suffix}`;
      const Key = `${uuidv4()}.${file.name.split(".").pop()}`;
      debugger;
      uploadVideo({
        variables: {
          input: {
            title: file.name,
            Key,
          },
        },
      });
      const uploadParams = {
        Bucket,
        Key,
        Body: file,
      };
      s3.upload(uploadParams, (err: any, data: any) => {
        if (err) return console.log(err);
        console.log(data);
      });
    }
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
