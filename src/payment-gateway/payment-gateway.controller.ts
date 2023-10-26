import { Body, Controller, Headers, HttpCode, Post, RawBodyRequest, Req, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { User as GetUser } from 'src/auth/decorators/user.decorator';
import { PaymentGatewayService } from './payment-gateway.service';

import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { User } from 'src/auth/schemas';
@Controller('payment')
@UseGuards(AuthGuard())
export class PaymentGatewayController {

    constructor(private readonly paymentGatewayService: PaymentGatewayService) { }

    @Post()
    @HttpCode(200)
    createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto, @GetUser() user: User) {
        return this.paymentGatewayService.createPayment(createPaymentIntentDto, user)
    }

    @Post('/webhooks')
    webhook( @Headers('stripe-signature') sig: string, @Req() req: RawBodyRequest<Request> ){
        return this.paymentGatewayService.confirmPayment(sig, req.rawBody)
    }
}