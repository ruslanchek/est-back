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
  name: string;
  path: string;
}

export interface IFileDeleteResult {
  path: string;
}

export interface IFileMeta {
  entityId: string;
  entityType: string;
  entityKind: string;
  imageId: string;
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

const JPEG_QUALITY: number = 86;
const WEBP_QUALITY: number = 86;
const BUCKET_URL: string = 'https://content-realthub-com.ams3.digitaloceanspaces.com/';

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

  private checkFileType(file: IFile): boolean {
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

  // TODO: Types
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

  // TODO: Types
  private deleteObject(params): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.s3.deleteObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  private async makeResizeCopy(file: IFile, size: IResizeDimension, type: 'webp' | 'jpg'): Promise<Buffer> {
    const { width, height } = size;

    switch(type) {
      case 'webp' : {
        return sharp(file.buffer)
          .withoutEnlargement()
          .max()
          .rotate()
          .resize(width, height)
          .webp({
            quality: WEBP_QUALITY,
            alphaQuality: WEBP_QUALITY,
            lossless: false,
            nearLossless: false,
            force: true,
          })
          .toBuffer();
      }

      case 'jpg' : {
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
    }
  }

  private getFileInfo(file: IFile): any {
    return sharp(file.buffer)
      .metadata();
  }

  // TODO: Remove EXIF etc...
  private async uploadResizeCopies(
    file: IFile,
    location: string,
    fileName: string,
    resizeDimensions: IResizeDimension[],
    meta: IFileMeta,
  ): Promise<IFileResult[]> {
    const filesResult: IFileResult[] = [];

    for (const resizeDimension of resizeDimensions) {
      const resizeJpg: Buffer = await this.makeResizeCopy(file, resizeDimension, 'jpg');
      const resizeWebp: Buffer = await this.makeResizeCopy(file, resizeDimension, 'webp');
      const path: string = Utils.removeDoubleSlashes(`${location}/${resizeDimension.name}/${fileName}`);

      await this.putObject({
        Body: resizeJpg,
        ACL: 'public-read',
        Bucket: process.env.S3_BUCKET,
        Key: `${path}.jpg`,
        ContentType: 'image/jpeg',
        Metadata: meta,
      });

      await this.putObject({
        Body: resizeWebp,
        ACL: 'public-read',
        Bucket: process.env.S3_BUCKET,
        Key: `${path}.webp`,
        ContentType: 'image/webp',
        Metadata: meta,
      });

      filesResult.push({
        name: resizeDimension.name,
        path,
      });

      console.log('uploaded:', resizeDimension.name);
    }

    return filesResult;
  }

  private async checkFile(file: IFile, maxSize: number): Promise<boolean | string> {
    return new Promise<boolean>(async (resolve, reject) => {
      if (!file || !file.buffer) {
        return reject('NO_FILE');
      }

      if (file.buffer.byteLength > maxSize) {
        return reject('MAX_SIZE');
      }

      if (!this.checkFileType(file)) {
        return reject('WRONG_FILE_TYPE');
      }

      return resolve(true);
    });
  }

  public getFullUrl(filePath: string): string {
    return Utils.removeDoubleSlashes(`${BUCKET_URL}${filePath}`);
  }

  public async deleteImage(files: string[]): Promise<IFileDeleteResult[]> {
    const result: IFileDeleteResult[] = [];

    for (const file of files) {
      if (file) {
        const deleteResult = await this.deleteObject({
          Bucket: process.env.S3_BUCKET,
          Key: file,
        });

        if (deleteResult) {
          result.push({
            path: file,
          });
        }
      }
    }

    return result;
  }

  public async uploadImage(
    file: IFile,
    location: string,
    fileName: string,
    maxSize: number,
    meta: IFileMeta,
    resizeDimensions: IResizeDimension[],
  ): Promise<IFileResult[]> {
    try {
      await this.checkFile(file, maxSize);
      return await this.uploadResizeCopies(file, location, fileName, resizeDimensions, meta);

    } catch (e) {
      console.log(e);
      
      return null;
    }
  }
}
