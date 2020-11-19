import youtubedl from "youtube-dl";
const stream = require("stream");
const passtrough = new stream.PassThrough();
const ffmpeg = require("fluent-ffmpeg");
import fs from "fs";
import s3 from "./aws";
import generateThumbnail from "./generateThumbnail";
import path from "path";

export default async (
  url: string,
  key: string
): Promise<{ fileName: string }> => {
  console.log({ url, key });
  return new Promise((resolve) => {
    const video = youtubedl(url, [], {});
    let fileName: string;
    // Will be called when the download starts.
    video.on("info", (info) => {
      console.log("Download started");
      console.log("filename: " + info._filename);
      fileName = info._filename;
      let { name } = path.parse(info._filename);
      fileName = name;
      console.log("size: " + info.size);
    });

    const { name } = path.parse(key);
    const newKey = name + ".mp4";

    const uploadParams = {
      Bucket: "streamio/test",
      Key: newKey,
    };
    const dl = video.pipe(passtrough);

    const filePath = `/tmp/${key}`;
    ffmpeg(dl)
      .duration(10 * 60)
      .format("mp4")
      .save(filePath)
      .on("end", async () => {
        await s3
          .upload({
            Body: fs.createReadStream(filePath),
            ...uploadParams,
          })
          .promise();
        await generateThumbnail(filePath, name);
        resolve({ fileName });
      });
  });
};
