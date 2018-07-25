import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { IApiResult, IApiResultList } from './api';

export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
}

export interface IFileResult {
  path: string;
  name: string;
}

@Injectable()
export class UploadService {
  private readonly spacesEndpoint;
  private readonly s3;

  constructor() {
    this.spacesEndpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);
    this.s3 = new AWS.S3({
      endpoint: this.spacesEndpoint,
      accessKeyId: process.env.S3_KEY,
      secretAccessKey: process.env.S3_SECRET,
    });
  }

  async upload(file: IFile, location: string, fileName: string, meta?: { [key: string]: string }): Promise<IFileResult> {
    const params = {
      Body: file.buffer,
      ACL: 'public-read',
      Bucket: process.env.S3_BUCKET,
      Key: `${location}/${fileName}`,
      ContentType: file.mimetype,
      ContentEncoding: file.encoding,
      Metadata: meta || {},
    };

    return new Promise<IFileResult>((resolve, reject) => {
      this.s3.putObject(params, (err, data) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }
}
