import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { URL } from "url"; // Import the URL module
dotenv.config();

const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export const postObject = async (name, file) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: name,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  await s3Client.send(command);

  const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: name,
  }));

  // Parse the signed URL
  const parsedUrl = new URL(signedUrl);

  // Construct the desired URL with only the necessary parts
  const desiredUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`;

  return desiredUrl;
};

const getObjectURL = async (key) => {
  const command = new GetObjectCommand({
    Bucket: "lecture-upload",
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
};
