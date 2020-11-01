import { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import fs from "fs";
import mongoose from "mongoose";
import Video from "./models";
import path from "path";
import s3 from "../utils/aws";

//const isProd = process.env.NODE_ENV === "production";
const dbName = "test";
const suffix = "Test";

const Bucket = `streamio/${suffix}`;
const url = `mongodb+srv://admin:admin@cluster0.vod8r.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (_req.method === "POST") {
      await mongoose.connect(url, { poolSize: 10, useNewUrlParser: true });
      mongoose.connection;
      let form = new multiparty.Form();
      form.parse(_req, async (_, __, files) => {
        const video = files.video[0];
        const Key = path.basename(video.path);
        const uploadParams = {
          Bucket,
          Key,
          Body: fs.createReadStream(video.path),
        };

        s3.upload(uploadParams, async function (err: any, data: any) {
          if (err) {
            console.log("Error", err);
          }
          if (data) {
            const name = path.parse(video.originalFilename).name;
            await Video.create({
              uuid: Key,
              name,
            });
            console.log("Upload Success", data.Location);
            res.status(200).json({ uuid: path.parse(Key).name, name });
          }
        });
      });
    } else {
      res.status(500).json({ statusCode: 405, message: "send post request" });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
