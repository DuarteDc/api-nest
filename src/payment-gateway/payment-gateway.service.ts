import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { User } from 'src/auth/schemas';

@Injectable()
export class PaymentGatewayService {

    private readonly stripe: Stripe;
    private readonly secretEndpoint: string;  

    constructor(configService: ConfigService) {
        this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), { apiVersion: '2023-10-16' })
        this.secretEndpoint = configService.get('SECRET_ENDPOINT')
    }

    async createPayment({ amount, order_id }: CreatePaymentIntentDto, user: User) {
        try {
            const { client_secret } = await this.stripe.paymentIntents.create({
                amount: amount * 100,
                currency: 'MXN',
                payment_method_types: ['card'],
                customer: user.payment_id,
                metadata: {
                    order_id
                }
            });
            return { client_secret };
        } catch (error) {
            this.handleError(error)
        }
    }

    async confirmPayment(stripeSignature: string, rawBody: any) {
        let event: Stripe.Event;
        try {
            event = this.stripe.webhooks.constructEvent(rawBody, stripeSignature, this.secretEndpoint );
            console.log(event);
        } catch (error) {
            console.log(error)
            return;
        }
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                break;
            case 'payment_intent.payment_failed':
                const paymentFailedIntent = event.data.object;
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }

    private handleError(error: any) {
        console.log(error)
        if( error instanceof HttpException ) throw error;
        throw new InternalServerErrorException('xD')
    }

}