import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import moment, { tz } from 'moment-timezone';

@Injectable()
export class CommonService {

    private readonly timezone: string;

    constructor (configService: ConfigService) { 
        this.timezone = configService.get('TIME_ZONE')
    }


    addMinutesToDate(minutes: number): NativeDate {
        return tz(this.timezone).add(minutes, 'minutes').toDate();
    }

    verifyExpirationDate(date: NativeDate): boolean {
        return moment(date) > tz(this.timezone)

    }

}