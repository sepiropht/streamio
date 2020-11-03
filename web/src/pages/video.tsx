//import axios from "axios";
import { useState } from "react";
import { Layout } from "../components/Layout";
import Link from "next/link";
//import { useUploadVideoMutation } from "../generated/graphql";
import { Video } from "../interfaces";
import { withApollo } from "../utils/withApollo";
import s3 from "../utils/aws";
import { v4 as uuidv4 } from "uuid";

const IndexPage = () => {
  const [videos] = useState<Video[]>([]);
  //const [uploadVideo] = useUploadVideoMutation();
  async function onChange(event: any) {
    // const formData = new FormData();
    // formData.append("video", event.target.files[0]);
    // const res = await axios.post("/upload", formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // })
    // const { data, errors } = await uploadVideo({
    //   // use the variables option so that you can pass in the file we got above
    //   variables: { file: event.target.files[0] },
    // });
    // console.log(data, errors);
    uploadAws(event.target.files[0]);
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
function uploadAws(file: File) {
  const suffix = "test";
  const Bucket = `streamio/${suffix}`;
  const Key = file.name;
  // const updateVideoStatus = () => {
  //   console.log("updateVideoStauts");
  //   getConnection()
  //     .createQueryBuilder()
  //     .update(Video)
  //     .set({ isConvertionPending: false })
  //     .where('"Key" = :Key', {
  //       Key,
  //     })
  //     .returning("*")
  //     .execute();
  //   console.log("conversiotn done");
  // };

  const uploadParams = {
    Bucket,
    Key,
    Body: file,
  };
  console.log("to awsss");
  s3.upload(uploadParams, (err: any, data: any) => {
    if (err) return console.log(err);
    console.log(data);
  });
}
