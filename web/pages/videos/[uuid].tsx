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
      <video src={src}></video>
    </Layout>
  );
};

export default StaticPropsDetail;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const AWS = require("aws-sdk");
    const s3 = new AWS.S3();
    const fs = require("fs");
    AWS.config.update({
      accessKeyId: "AKIAXBZO77ZFN2CUMQ6T",
      secretAccessKey: "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",
    });

    AWS.config.update({ region: "eu-west-3" });

    // Create S3 service object
    const uuid = params?.uuid;
    const items = { uuid, name: "saturations" };
    const Key = uuid + ".mkv";
    console.log({ Key });

    const data = await s3.getObject({ Bucket: "streamio/Test", Key }).promise();

    console.log(
      "downlaod success",
      //Object.keys(data).map((key) => key),
      data.Body
    );
    fs.writeFileSync(Key, data.Body);
    // do something with data.Body
    console.log("return");
    return { props: { items, src: Key } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
