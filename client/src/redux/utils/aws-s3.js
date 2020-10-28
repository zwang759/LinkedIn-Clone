import api from "./api";
import {S3_URL} from "../../enum/enum";

export const uploadFile = async (file) => {
  // get pre-signed url to awsS3
  const response = await api.get(`/api/aws_s3/sign_put?contentType=${file.type}`);
  // awsS3
  await api.put(response.data.url,
    file,
    {headers: {"Content-Type": file.type}});
  const filename = response.data.filename;
  const fileLocation = S3_URL + response.data.filename;

  return [filename, fileLocation];
};

export const uploadBase64 = async (base64) => {
  // decode base64 image
  const fileContent = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");
  // get pre-signed put url
  const contentType = base64.split(";")[0].split("/")[1];
  const response = await api.get(`/api/aws_s3/sign_put_base64?contentType=${contentType}`);
  // awsS3
  await api.put(response.data.url,
    fileContent,
    {headers: {"Content-Type": `image/${contentType}`}});

  const filename = response.data.filename;
  const fileLocation = S3_URL + response.data.filename;
  return [filename, fileLocation];
};

export const deleteFile = async (filename) => {
  await api.delete(`/api/aws_s3/file?filename=${filename}`);
};