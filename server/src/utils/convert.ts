import s3 from "./aws";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import generateThumbnail from "./generateThumbnail";
import fs from "fs";

export default async (
  Key: string
): Promise<{ oldKey: string; newKey: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("IIIIIIIIIII CONVERT");

      const videoStreamFromAws = s3
        .getObject({
          Bucket: "streamio/test",
          Key,
        })
        .createReadStream();

      const { name } = path.parse(Key);
      const newKey = name + ".mp4";

      const uploadParams = {
        Bucket: "streamio/test",
        Key: newKey,
      };
      const filePath = `/tmp/${name}`;
      ffmpeg(videoStreamFromAws)
        .audioCodec("aac")
        .videoCodec("libx264")
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

          resolve({ oldKey: Key, newKey });
        });
    } catch (err) {
      reject(err);
    }
  });
};
