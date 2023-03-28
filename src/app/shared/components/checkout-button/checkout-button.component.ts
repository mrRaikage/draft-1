import { Component, Input, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-checkout-button',
  templateUrl: './checkout-button.component.html',
  styleUrls: ['./checkout-button.component.scss']
})
export class CheckoutButtonComponent extends ButtonComponent implements OnInit {

  @Input() amount: number;

  paymentHandler: any = null;

  ngOnInit(): void {
    this.invokeStripe();
  }

  makePayment(amount): void {
    const paymentHandler = (window as any).StripeCheckout.configure({
      key: 'pk_test_51H7bbSE2RcKvfXD4DZhu',
      locale: 'auto',
      token: (stripeToken: any) => {
        console.log(stripeToken);
        alert('Stripe token generated!');
      }
    });

    paymentHandler.open({
      name: 'Positronx',
      description: '3 widgets',
      amount: amount * 100
    });
  }

  invokeStripe(): void {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (window as any).StripeCheckout.configure({
          key: 'pk_test_51H7bbSE2RcKvfXD4DZhu',
          locale: 'auto',
          token: (stripeToken: any) => {
            console.log(stripeToken);
            alert('Payment has been successfull!');
          }
        });
      };

      window.document.body.appendChild(script);
    }
  }

}
