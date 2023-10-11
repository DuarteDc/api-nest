import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as moment from 'moment-timezone';

@Injectable()
export class CommonService {

    private readonly timezone: string;

    constructor (configService: ConfigService) { 
        this.timezone = configService.get('TIME_ZONE')
    }

    addMinutesToDate(minutes: number): NativeDate {
        return moment.tz(this.timezone).add(minutes, 'minutes').toDate();
    }

    verifyExpirationDate(date: NativeDate): boolean {
        return moment(date) > moment.tz(this.timezone);
    }

}