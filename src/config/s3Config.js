import { S3Client } from "@aws-sdk/client-s3";
const s3 = new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY, 
      secretAccessKey: process.env.SECRET_KEY,
    },
    region: "global",
  });

export {s3}