// const { Converter } = require("ffmpeg-stream");
// import { resolve } from "path";
// import s3 from "./aws";

// export default (Key: string): Promise<string> => {
//   const converter = new Converter();

//   const input = converter.createInputStream({});

//   converter.run();

//   s3.getObject({
//     Bucket: "streamio/test",
//     Key,
//   })
//     .createReadStream()
//     .pipe(input);

//   const videoStream = converter.createOutputStream({
//     f: "mp4",
//   });
//   const uploadParams = {
//     Bucket: "streamio/test",
//     Key,
//     Body: videoStream,
//   };
//   return s3.upload(uploadParams, (err: any, _: any) => {
//     if (err) return resolve(err);
//     return resolve(Key);
//   });
// };
