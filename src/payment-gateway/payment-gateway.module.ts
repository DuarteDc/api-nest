import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentGatewayController } from './payment-gateway.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    controllers: [ PaymentGatewayController ],
    providers: [ PaymentGatewayService  ],
    imports: [ ConfigModule ]
})
export class PaymentGatewayModule { }
