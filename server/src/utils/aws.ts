import AWS from "aws-sdk";

// Set the region
AWS.config.update({
  accessKeyId: "AKIAXBZO77ZFN2CUMQ6T",
  secretAccessKey: "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",
});

AWS.config.update({ region: "eu-west-3" });

// Create S3 service object
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

export default s3;
