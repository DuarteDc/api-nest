import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Resend } from 'resend';

@Injectable()
export class MailingService {

    constructor( private readonly configService: ConfigService, private readonly mailerService: MailerService) {

    }

     async sendMail() {
        const resend = new Resend(this.configService.get('RESEND_SECRET_KEY'));
        resend.emails.send({
            from: 'xd@xdxd.com',
            to: 'duartedc17@gmail.com',
            subject: 'xD',
            html: '<p>example</p>'
        })
    }

}
