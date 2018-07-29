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
  name: string;
  width: number;
  height: number;
}

export const MAX_UPLOAD_SIZE = {
  AVATAR: 5242880, // 5 MB
  OBJECT_PICTURE: 26214400, // 25 MB
};

export const UPLOAD_IMAGE_RESIZE_DIMENSIONS = {
  AVATAR: {
    name: 'default',
    width: 256,
    height: 256,
  },
  IMAGE: {
    name: 'big',
    width: 1920,
    height: 1080,
  },
  IMAGE_THUMB: {
    name: 'thumb',
    width: 512,
    height: 512,
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

const JPEG_QUALITY = 90;

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

  private extractExtension(filename: string): string {
    return filename.split('.').pop();
  }

  private putObject(params): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.s3.putObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  private async makeResizeCopy(file: IFile, fileInfo, size: IResizeDimension): Promise<Buffer> {
    const {width, height} = size;

    return sharp(file.buffer)
      .withoutEnlargement()
      .max()
      .rotate()
      .resize(width, height)
      .jpeg({
        quality: JPEG_QUALITY,
      })
      .toBuffer();
  }

  private async getFileInfo(file: IFile): Promise<Buffer> {
    return sharp(file.buffer)
      .metadata();
  }

  private async uploadResizeCopies(file: IFile, location: string, fileName: string, resizeDimensions: IResizeDimension[], meta: IFileMeta) {
    const fileInfo = await this.getFileInfo(file);

    for (const resizeDimension of resizeDimensions) {
      const resize: Buffer = await this.makeResizeCopy(file, fileInfo, resizeDimension);
      const path: string = Utils.removeDoubleSlashes(`${location}/${resizeDimension.name}/${fileName}.jpg`);

      await this.putObject({
        Body: resize,
        ACL: 'public-read',
        Bucket: process.env.S3_BUCKET,
        Key: path,
        ContentType: 'image/jpeg',
        Metadata: meta,
      });

      console.log('uploaded:', resizeDimension.name);
    }
  }

  private async checkFile(file: IFile, maxSize: number): Promise<boolean | string> {
    return new Promise<boolean>(async (resolve, reject) => {
      if (file.buffer.byteLength > maxSize) {
        return reject('MAX_SIZE');
      }

      if (!this.checkFileType(file)) {
        return reject('WRONG_FILE_TYPE');
      }

      return resolve(true);
    });
  }

  public async uploadImage(
    file: IFile,
    location: string,
    fileName: string,
    maxSize: number,
    meta: IFileMeta,
    resizeDimensions: IResizeDimension[],
  ): Promise<any> {
    try {
      await this.checkFile(file, maxSize);
      await this.uploadResizeCopies(file, location, fileName, resizeDimensions, meta);

    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
