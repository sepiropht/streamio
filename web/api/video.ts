import { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import AWS from "aws-sdk";
import fs from "fs";
// Set the region
AWS.config.update({
  accessKeyId: "AKIAXBZO77ZFN2CUMQ6T",
  secretAccessKey: "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",
});

AWS.config.update({ region: "eu-west-3" });

// Create S3 service object
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (_req.method === "POST") {
      let form = new multiparty.Form();
      form.parse(_req, (err, fields, files) => {
        console.log({ files, fields });
        const video = files.video[0];
        console.log(video);
        const uploadParams = {
          Bucket: "streamio",
          Key: video.originalFilename,
          Body: fs.createReadStream(video.path),
        };

        s3.upload(uploadParams, function (err: any, data: any) {
          if (err) {
            console.log("Error", err);
          }
          if (data) {
            console.log("Upload Success", data.Location);
            res.status(200).json({ url: data.Location });
          }
        });
      });
    } else {
      res.status(500).json({ statusCode: 405, message: "send post request" });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
