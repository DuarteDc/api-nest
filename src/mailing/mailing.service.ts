import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Resend } from 'resend';

@Injectable()
export class MailingService {

    constructor( private readonly configService: ConfigService, private readonly mailerService: MailerService) {

    }

     async sendMail() {
      try {
        const resend = new Resend(this.configService.get('RESEND_SECRET_KEY'));
        
        await resend.emails.send({
            from: 'al221910409@gmail.com',
            to: 'duartedc17@gmail.com',
            subject: 'xD',
            html: '<p>example</p>'
        })
      } catch (error) {
        console.log(error)
      }
    }

}
