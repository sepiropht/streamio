import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

export default async (videoPath: string, key: string, client: any) => {
  console.log("generate thumbnail");
  const dir = key;
  fs.mkdirSync(dir);
  new Promise((resolve, reject) => {
    try {
      ffmpeg(videoPath)
        .on("filenames", function (filenames) {
          console.log("Will generate " + filenames.join(", "));
        })
        .on("end", function () {
          console.log("Screenshots taken");
        })
        .screenshots({ count: 1, folder: "/tmp/" + key })
        .on("end", (data: any) => {
          console.log(data);
          fs.createReadStream(`/tmp/${key}/tn.png`).pipe(
            fs.createWriteStream(`images/${key}.jpg`).on("close", () => {
              //fs.rmdirSync(key, { recursive: true });
              console.log("IMAGE READY");
              client.send(
                JSON.stringify({ imageReady: true, Key: key + ".mp4" })
              );
              resolve();
            })
          );
        });
    } catch (err) {
      reject(err);
    }
  });
};
