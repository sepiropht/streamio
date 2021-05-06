import AWS from "aws-sdk";

// Set the region
AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});

AWS.config.update({ region: "eu-west-3" });

// Create S3 service object
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

export default s3;
