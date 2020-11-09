import s3 from "./aws";
import stream from "stream";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

export default async (videoPath: string, Key: string) => {
  new Promise((resolve, reject) => {
    try {
      ffmpeg(videoPath)
        .on("filenames", function (filenames) {
          console.log("Will generate " + filenames.join(", "));
        })
        .on("end", function () {
          console.log("Screenshots taken");
        })
        .screenshots({})
        .pipe(uploadFromStream())
        .on("end", (data: any) => {
          console.log(data);
          console.log("MEREEEEEEEEEEEEEEEEEE jen ai marre");
          resolve();
        });
      const { name } = path.parse(Key);
      const newKey = name + ".png";
      const uploadParams = {
        Bucket: "streamio/test",
        Key: newKey,
      };

      function uploadFromStream() {
        const pass = new stream.PassThrough();
        console.log({ uploadParams });
        s3.upload({ Body: pass, ...uploadParams }, (err: any, data: any) => {
          if (err) return console.log("MMMMMMMMMMMMMMMERDE", err);
          console.log(data, "MMMMMMMMMMMMMMMMMMMMERDEIEIIEIRIRIRI");
        });
        return pass;
      }
    } catch (err) {
      reject(err);
    }
  });
};
