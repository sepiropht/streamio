const { Converter } = require("ffmpeg-stream");
import { Readable } from "stream";

export default function convert(stream: Readable): Readable {
  console.log(">CONNNNNNNNNNNNNVERT");
  const converter = new Converter();

  const input = converter.createInputStream({});
  stream.pipe(input);
  console.log("VONVER not run yet");
  converter.run();
  console.log("VONVER run yet");
  return converter.createOutputStream({
    f: "mp4",
  });
}
