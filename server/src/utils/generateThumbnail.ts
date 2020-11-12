import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

export default async (videoPath: string, key: string) => {
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
        .screenshots({ count: 1, folder: key })
        .on("end", (data: any) => {
          console.log(data);
          fs.createReadStream(`${key}/tn.png`).pipe(
            fs.createWriteStream(`images/${key}.jpg`)
          );
          console.log("FINISH GENNERATE THYMBNAIL");
          resolve();
        });
    } catch (err) {
      reject(err);
    }
  });
};
