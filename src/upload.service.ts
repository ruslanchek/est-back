import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Utils } from './utils';
import * as sharp from 'sharp';

export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
}

export interface IFileTypes {
  extension: string;
  mimeType: string;
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

interface IResizeDimension {
  sizes: [string, number, number];
}

export const MAX_UPLOAD_SIZE = {
  AVATAR: 5242880, // 5 MB
  OBJECT_PICTURE: 26214400, // 25 MB
};

export const UPLOAD_IMAGE_RESIZE_DIMENSIONS: { [name: string]: IResizeDimension } = {
  AVATAR: {
    sizes: [null, 256, 256],
  },
  IMAGE: {
    sizes: ['image', 1920, 1080],
  },
  IMAGE_THUMB: {
    sizes: ['thumb', 512, 512],
  },
};

export const IMAGE_EXTENSIONS: IFileTypes[] = [
  {
    extension: 'jpg',
    mimeType: 'image/jpeg',
  },

  {
    extension: 'jpeg',
    mimeType: 'image/jpeg',
  },

  {
    extension: 'jpe',
    mimeType: 'image/jpeg',
  },

  {
    extension: 'png',
    mimeType: 'image/png',
  },
];

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

  checkFileType(file: IFile): boolean {
    let result: boolean = false;
    const ext: string = this.extractExtension(file.originalname);

    IMAGE_EXTENSIONS.forEach(element => {
      if (element.extension === ext && element.mimeType === file.mimetype) {
        result = true;
      }
    });

    return result;
  }

  extractExtension(filename: string): string {
    return filename.split('.').pop();
  }

  private async makeResizedCopy(file: IFile, size: IResizeDimension): Promise<Buffer> {
    return sharp(file.buffer)
      .resize(size.sizes[1], size.sizes[2])
      .jpeg()
      .toBuffer();
  }

  public async uploadImage(
    file: IFile,
    location: string,
    fileName: string,
    maxSize: number,
    meta: IFileMeta,
    resizeDimensions: IResizeDimension[],
  ): Promise<IFileResult> {
    return new Promise<IFileResult>(async (resolve, reject) => {
      if (file.buffer.byteLength > maxSize) {
        return reject('MAX_SIZE');
      }

      if (!this.checkFileType(file)) {
        return reject('WRONG_FILE_TYPE');
      }

      if (resizeDimensions.length > 0) {
        const resized: Buffer = await this.makeResizedCopy(file, resizeDimensions[0]);
        const path: string = Utils.removeDoubleSlashes(`${location}/${fileName}.jpg`);

        const params = {
          Body: resized,
          ACL: 'public-read',
          Bucket: process.env.S3_BUCKET,
          Key: path,
          ContentType: 'image/jpeg',
          Metadata: meta,
        };

        this.s3.putObject(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              path,
              name: fileName,
            });
          }
        });
      } else {

      }
    });
  }
}
