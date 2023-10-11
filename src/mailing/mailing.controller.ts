import { Controller, Get } from '@nestjs/common';
import { MailingService } from './mailing.service';

@Controller('mailing')
export class MailingController {

    constructor(private readonly mailingService: MailingService) {}

    @Get('mail')
    sendEmail() {
        return this.mailingService.sendMail()
    }
}
