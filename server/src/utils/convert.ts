import s3 from "./aws";
import path from "path";
import stream from "stream";
import ffmpeg from "fluent-ffmpeg";
import generateThumbnail from "./generateThumbnail";
import fs from "fs";

export default async (
  Key: string
): Promise<{ oldKey: string; newKey: string }> => {
  return new Promise((resolve, reject) => {
    try {
      console.log("IIIIIIIIIII CONVERT");

      const videoStreamFromAws = s3
        .getObject({
          Bucket: "streamio/test",
          Key,
        })
        .createReadStream();
      console.log("yeah");

      const { name } = path.parse(Key);
      const newKey = name + ".mp4";
      const uploadParams = {
        Bucket: "streamio/test",
        Key: newKey,
      };

      function uploadFromStream(s3: any) {
        const pass = new stream.PassThrough();
        console.log({ uploadParams });
        s3.upload({ Body: pass, ...uploadParams }, (err: any, data: any) => {
          if (err) return console.log("MMMMMMMMMMMMMMMERDE", err);
          console.log(data, "MMMMMMMMMMMMMMMMMMMMERDEIEIIEIRIRIRI");
        });
        return pass;
      }

      ffmpeg(videoStreamFromAws)
        .audioCodec("aac")
        .videoCodec("libx264")
        .format("mp4")
        .pipe(uploadFromStream(s3))
        .on("end", async (data: any) => {
          console.log(data);
          console.log("MEREEEEEEEEEEEEEEEEEE jen ai marre");
          const pathFile = `tmp\${Key}`;
          fs.writeFileSync(pathFile, data.Body);
          await generateThumbnail(pathFile, Key);
          resolve({ oldKey: Key, newKey });
        });
    } catch (err) {
      reject(err);
    }
  });
};
