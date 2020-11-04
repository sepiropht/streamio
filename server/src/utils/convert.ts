const { Converter } = require("ffmpeg-stream");
import s3 from "./aws";
import path from "path";
import stream from "stream";
//import fs from "fs";
export default async (
  Key: string
): Promise<{ oldKey: string; newKey: string }> => {
  return new Promise((resolve, reject) => {
    try {
      console.log("IIIIIIIIIII CONVERT");
      const converter = new Converter();

      const input = converter.createInputStream({});

      console.log(Key, "KEEEEEEEEEEEEEEEEEEEEYYYYYY");
      s3.getObject({
        Bucket: "streamio/test",
        Key,
      })
        .createReadStream()
        .pipe(input);
      console.log("yeah");

      const { name } = path.parse(Key);
      const newKey = name + ".mp4";
      const uploadParams = {
        Bucket: "streamio/test",
        Key: newKey,
      };

      function uploadFromStream(s3: any) {
        var pass = new stream.PassThrough();
        s3.upload({ Body: pass, ...uploadParams }, (err: any, data: any) => {
          if (err) return console.log("MMMMMMMMMMMMMMMERDE", err);
          console.log(data);
        });
        return pass;
      }

      converter
        .createOutputStream({
          f: "webm",
        })
        .pipe(uploadFromStream(s3))
        .on("end", () => {
          console.log("FINISH!!!!!!!!!!!!!!!");
          resolve({ oldKey: Key, newKey });
        });

      converter.run();
    } catch (err) {
      reject(err);
    }
  });
};
