import { GetServerSideProps } from "next";

import { Video } from "../../interfaces";
import Layout from "../../components/Layout";
//import ListDetail from "../../components/ListDetail";

type Props = {
  item?: Video;
  src: string;
  errors?: string;
};

const StaticPropsDetail = ({ item, src, errors }: Props) => {
  if (errors) {
    return (
      <Layout title="Error | Next.js + TypeScript Example">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${
        item ? item.name : "User Detail"
      } | Next.js + TypeScript Example`}
    >
      <video controls>
        <source src={src} type="video/mp4" />
      </video>
    </Layout>
  );
};

export default StaticPropsDetail;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    // Create S3 service object
    const uuid = params?.uuid;
    // TODO get real name from mongoDB
    const items = { uuid, name: "saturations" };
    const src = `http://localhost:4000/video?uuid=${uuid}`;
    return { props: { items, src } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
