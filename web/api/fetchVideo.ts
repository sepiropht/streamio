import { NextApiRequest, NextApiResponse } from "next";
import streamify from "../utils/streamify";
import fs from "fs";
import s3 from "../utils/aws";

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log(_req.query);
    const { uuid } = _req.query;
    const Key = uuid + ".mkv";
    console.log({ Key });

    s3.getObject({ Bucket: "streamio/Test", Key }, (err: any, data: any) => {
      if (err) return console.log(err);
      console.log(
        "downlaod successsss",
        //Object.keys(data).map((key) => key),
        data.Body
      );
      fs.writeFileSync(Key, data.Body);
      streamify(Key, _req, res);
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
