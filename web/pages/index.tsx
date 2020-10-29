import axios from "axios";
import Layout from "../components/Layout";

const IndexPage = () => {
  function onChange(event: any) {
    console.log(event.target.files[0]);
    axios.post("/video", {
      video: event.target.files[0],
    });
  }
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <input
        type="file"
        name="file"
        placeholder="paste video url"
        onChange={onChange}
      />
    </Layout>
  );
};

export default IndexPage;
