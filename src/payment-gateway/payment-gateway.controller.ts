import { Controller, Get, Headers, Post, RawBodyRequest, Req, Res } from '@nestjs/common';

import { PaymentGatewayService } from './payment-gateway.service';

@Controller('payment')
export class PaymentGatewayController {

    constructor(private readonly paymentGatewayService: PaymentGatewayService) { }

    @Get()
    test() {
        return this.paymentGatewayService.createPayment(100, 'MXN')
    }

    @Post('/webhooks')
    webhook( @Headers('stripe-signature') sig: string, @Req() req: RawBodyRequest<Request> ){
        return this.paymentGatewayService.confirmPayment(sig, req.rawBody)
    }
}