import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailingService {
	private transport: nodemailer.Transporter = null;

	constructor() {
		this.transport = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: 'ruslanchek@gmail.com',
				pass: 'gxgkyndjizgnjdah'
			}
		});
	}

	private createMailOptions(): MailOptions {
		return {
			from: 'Ruslan Shashkov ✔ <ruslanchek@gmail.com>',
			to: 'rshashkov@icloud.com',
			subject: 'Hello ✔',
			text: 'Hello world ✔',
			html: '<b>Hello world ✔</b>'
		};
	}

	public send(): void {
		this.transport.sendMail(this.createMailOptions(), (error, response) => {
			if (error) {
				console.log(error);
			} else {
				console.log("Message sent: " + response.message);
			}
		});
	}
}