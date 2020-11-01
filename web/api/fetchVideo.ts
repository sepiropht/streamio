import { NextApiRequest, NextApiResponse } from "next";
import streamify from "../utils/streamify";
import s3 from "../utils/aws";
import { Video } from "./models";
const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log(_req.query);
    const { uuid } = _req.query;
    let video;
    if (typeof uuid === "string") {
      video = await Video.findOne({ uuid });
      console.log({ video });
      const Key = uuid + video?.extention;
      console.log({ Key });
      s3.getObject({ Bucket: "streamio/test", Key }, (err: any, data: any) => {
        if (err) return console.log(err);
        console.log("downlaod successsss", data.Body);
        streamify(data.Body, _req, res);
      });
    } else {
      throw "query is not a string";
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
