import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/smtp-transport';
import * as Mustache from 'Mustache';
import * as fs from 'fs';

export interface IMailDataForWelcome extends IMailDataFor {
  verificationCode: string;
}

interface IMailDataFor {
  agentName: string;
  agentEmail: string;
  agentId: number;
}

interface IMailData {
  to: string;
  subject: string;
  userName: string;
  pre: string;
  title: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
}

const TEMPLATES_DIR: string = '/templates';
const FROM_ADDRESS: string = 'mail@realthub.com';
const FROM_NAME: string = 'Realthub';

@Injectable()
export class MailingService {
  private transport: nodemailer.Transporter = null;
  private templates: {
    [key: string]: string;
  } = {};

  constructor() {
    this.templates.transactional = this.loadTemplate('transactional.email.mst');

    this.transport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ruslanchek@gmail.com',
        pass: 'gxgkyndjizgnjdah',
      },
    });
  }

  private loadTemplate(fileName: string): string {
    return fs.readFileSync(`${__dirname}${TEMPLATES_DIR}/${fileName}`, {
      encoding: 'utf8',
    });
  }

  private render(template: string, data: any): string {
    return Mustache.render(template, data);
  }

  private createMailOptions(data: IMailData): MailOptions {
    const dataLocal = Object.assign({
      siteUrl: 'https://realthub.com?from=email',
      linkUnderLogoUrl: 'https://realthub.com?from=email',
      linkUnderLogoText: 'realthub.com',
      pre: data.pre,
      title: data.title,
      body: data.body,
      buttonText: data.buttonText,
      post: 'If you received this email by mistake, simply delete it. You won\'t be subscribed if you don\'t click the confirmation link above.',
      buttonUrl: 'https://realthub.com',
      copyright: 'Copyright © 2017–2018 Realthub Ltd. All rights reserved.',
      nav: [
        { title: 'Contacts', url: 'https://realthub.com/about/contacts?from=email' },
        { title: 'Advertise', url: 'https://realthub.com/about/advertise?from=email' },
        { title: 'Terms', url: 'https://realthub.com/about/terms?from=email' },
        { title: 'Privacy', url: 'https://realthub.com/about/privacy?from=email' },
      ],
      unsubscribeLinkText: 'Unsubscribe',
      unsubscribeLinkUrl: 'https://realthub.com/unsubscribe?from=email',
    }, data);

    const html: string = this.render(this.templates.transactional, dataLocal);

    return {
      from: `${FROM_NAME} <${FROM_ADDRESS}>`,
      to: dataLocal.to,
      subject: dataLocal.subject,
      text: '',
      html,
    };
  }

  public async sendWelcome(data: IMailDataForWelcome): Promise<boolean> {
    const dataProcessed: IMailData = {
      to: data.agentEmail,
      subject: 'Welcome to Realthub',
      userName: data.agentName,
      pre: `Hi ${data.agentName},`,
      title: 'Registration almost complete...',
      body: 'Thank you for your registration! Please confirm your subscription to verify your account.',
      buttonText: 'Verify account',
      buttonUrl: `https://realthub.com/verification/email/${data.verificationCode}`,
    };

    return await this.send(this.createMailOptions(dataProcessed));
  }

  private send(data: MailOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.transport.sendMail(data, (error, response) => {
        if (error) {
          console.error(error);
          reject(false);
        } else {
          resolve(true);
          console.log('Message sent: ' + response.message);
        }
      });
    });
  }
}
