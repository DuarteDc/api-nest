import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentGatewayController } from './payment-gateway.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [ PaymentGatewayController ],
    providers: [ PaymentGatewayService  ],
    imports: [ ConfigModule, AuthModule ]
})
export class PaymentGatewayModule { }
