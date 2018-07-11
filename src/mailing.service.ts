import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/smtp-transport';
import * as Mustache from 'Mustache';
import * as fs from 'fs';

const TEMPLATES_DIR: string = '/templates';

@Injectable()
export class MailingService {
  private transport: nodemailer.Transporter = null;
  private templates: { [key: string]: string; } = {};

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

  private createMailOptions(): MailOptions {
    const data = {
      siteUrl: 'https://realthub.com?from=email',
      linkUnderLogoUrl: 'https://realthub.com?from=email',
      linkUnderLogoText: 'View in browser',
      pre: 'Hi Ilya,',
      title: 'You are almost Finished...',
      body: 'Thank you for participating in our Beta! Please confirm your subscription to claim your account.',
      buttonText: 'Complete registration',
      post: 'If you received this email by mistake, simply delete it. You won\'t be subscribed if you don\'t click the confirmation link above.',
      buttonUrl: 'https://realthub.com',
      copyright: 'Copyright © 2017–2018 Realthub Ltd. All rights reserved.',
      nav: [
        {title: 'Contacts', url: 'https://realthub.com/about/contacts?from=email'},
        {title: 'Advertise', url: 'https://realthub.com/about/advertise?from=email'},
        {title: 'Terms', url: 'https://realthub.com/about/terms?from=email'},
        {title: 'Privacy', url: 'https://realthub.com/about/privacy?from=email'},
      ],
      unsubscribeLinkText: 'Unsubscribe',
      unsubscribeLinkUrl: 'https://realthub.com/unsubscribe?from=email',
    };

    const html: string = this.render(this.templates.transactional, data);

    return {
      from: `Realthub <mail@realthub.com>`,
      to: 'ipa.725@gmail.com',
      subject: data.title,
      text: 'Hello!',
      html,
    };
  }

  public send(): void {
    this.transport.sendMail(this.createMailOptions(), (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent: ' + response.message);
      }
    });
  }
}