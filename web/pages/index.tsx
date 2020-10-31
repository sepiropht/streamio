import axios from "axios";
import { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";

import { Video } from "../interfaces";

const IndexPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  async function onChange(event: any) {
    const formData = new FormData();
    formData.append("video", event.target.files[0]);

    const res = await axios.post("/api/video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setVideos([...videos, res.data]);
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
    <Layout title="Home | Next.js + TypeScript Example">
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

export default IndexPage;
