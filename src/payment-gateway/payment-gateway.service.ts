import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentGatewayService {

    private readonly stripe: Stripe;

    constructor(configService: ConfigService) {
        this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2023-10-16',
        })
    }

    async createPayment(amount = 50, currency = 'MXN') {
        try {
            return this.stripe.paymentIntents.create({
                amount: amount * 100,
                currency,
            });
        } catch (error) {
            console.log(error)
        }
    }


    async confirmPayment(stripeSignature: string, rawBody: any) {
        try {
            let event: Stripe.Event;
            event =  this.stripe.webhooks.constructEvent(rawBody, stripeSignature, 'whsec_179ccc76064eedfacef3c978d63e02f2eb8d192f4a1365ed06fbcfa435170c9d');
            console.log(event);
            return event.type;
        } catch (error) {
            console.log(error)
        }
    }

}