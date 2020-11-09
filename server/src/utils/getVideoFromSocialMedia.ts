import fs from "fs";
import youtubedl from "youtube-dl";

export default (url: string) => {
  const video = youtubedl(url, [], {});

  // Will be called when the download starts.
  video.on("info", (info: any) => {
    console.log("Download started");
    console.log("filename: " + info._filename);
    console.log("size: " + info.size);
  });
  const options = {
    // Downloads available thumbnail.
    all: false,
    // The directory to save the downloaded files in.
    cwd: "/tmp",
  };
  youtubedl.getThumbs(url, options, function (err: any, files: string[]) {
    if (err) throw err;
    console.log("thumbnail file downloaded:", files);
  });
  video.pipe(fs.createWriteStream("myvideo.mp4"));
};
