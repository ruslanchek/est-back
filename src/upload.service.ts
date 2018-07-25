import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Utils } from './utils';

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

export interface IFileMeta {
  entityId: string;
  entityType: string;
  entityKind: string;
}

export const MAX_UPLOAD_SIZE = {
  AVATAR: 5242880, // 5 MB
  OBJECT_PICTURE: 26214400, // 25 MB
};

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

  async upload(file: IFile, location: string, fileName: string, maxSize: number, meta?: IFileMeta): Promise<IFileResult> {
    return new Promise<IFileResult>((resolve, reject) => {
      const path: string = Utils.removeDoubleSlashes(`${location}/${fileName}`);

      if (file.buffer.byteLength > maxSize) {
        return reject('MAX_SIZE');
      }

      const params = {
        Body: file.buffer,
        ACL: 'public-read',
        Bucket: process.env.S3_BUCKET,
        Key: path,
        ContentType: file.mimetype,
        ContentEncoding: file.encoding,
        Metadata: meta || {},
      };

      this.s3.putObject(params, (err, data) => {
        if (err) {
          reject();
        } else {
          resolve({
            path,
            name: fileName,
          });
        }
      });
    });
  }
}
