import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
}

@Injectable()
export class UploadService {
  private readonly spacesEndpoint;
  private readonly s3;

  constructor() {
    this.spacesEndpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com');
    this.s3 = new AWS.S3({
      endpoint: this.spacesEndpoint,
      accessKeyId: '4LE7IDJ3NQGU7JX4C262',
      secretAccessKey: 'GNGjB+L0mXvqYzlMTp2eAS4hqtkMEGNOrWnEblh820Q',
    });
  }

  upload(file: IFile) {
    const params = {
      Body: file.buffer.toString(),
      Bucket: 'content-realthub-com',
      Key: 'file.ext',
    };

    this.s3.putObject(params, (err, data) => {
      console.log(err, data);
    });
  }
}
