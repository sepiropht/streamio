import axios from "axios";
import { useState } from "react";
import Layout from "../components/Layout";

const IndexPage = () => {
  const [urls, setUrl] = useState<string[]>([]);
  async function onChange(event: any) {
    console.log(event.target.files[0]);
    var formData = new FormData();
    formData.append("video", event.target.files[0]);
    const res = await axios.post("/api/video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setUrl([...urls, res.data.url]);
  }
  const ListUrls = urls.map((url, index) => <li key={index}>{url}</li>);
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <input
        type="file"
        name="file"
        placeholder="paste video url"
        onChange={onChange}
      />
      <ul>{ListUrls}</ul>
    </Layout>
  );
};

export default IndexPage;
