import { NextApiRequest, NextApiResponse } from "next";
import streamify from "../utils/streamify";

const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const fs = require("fs");
AWS.config.update({
  accessKeyId: "AKIAXBZO77ZFN2CUMQ6T",
  secretAccessKey: "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",
});

AWS.config.update({ region: "eu-west-3" });

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Create S3 service object
    console.log(_req.query);
    const { uuid } = _req.query;
    const Key = uuid + ".mkv";
    console.log({ Key });

    const data = await s3.getObject({ Bucket: "streamio/Test", Key }).promise();

    console.log(
      "downlaod successsss",
      //Object.keys(data).map((key) => key),
      data.Body
    );
    fs.writeFileSync(Key, data.Body);
    streamify(Key, _req, res);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
