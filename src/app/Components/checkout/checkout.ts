import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

import { CheckoutServices } from '../../Services/checkout-services';
import { BasketServices } from '../../Services/basket-services';
import { PayService } from '../../Services/pay-service';

import { IDeliveryMethod, OrderDto } from '../../Interfaces/Iorder-dto';
import { AddToBasketDto, Data, Item } from '../../Interfaces/IcustomerBasket';

import { loadStripe, PaymentIntentResult, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
  CommonModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit, OnDestroy {

  // forms
  shippingForm: FormGroup;
  deliveryForm: FormGroup;

  // steps
  activeStep = 0;

  // delivery / totals
  selectedDeliveryMethod!: IDeliveryMethod | null;
  total = 0;
  shippingPrice = 0;
  subtotal = 0;

  // basket & delivery methods
  basketData!: Data;
  deliveryMethods: IDeliveryMethod[] = [];
  BasketId: string = '';

  // dto helper
  selectedDelivery: any = null;
  addBasketDto!: AddToBasketDto;

  // stripe
  clientSecret: string = '';
  stripe: Stripe | null = null;
  stripeElements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;

  constructor(
    private fb: FormBuilder,
    private checkService: CheckoutServices,
    private basketService: BasketServices,
    private payService: PayService,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      street: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });

    this.deliveryForm = this.fb.group({
      deliveryMethod: ['', Validators.required]
    });

    this.BasketId = String(localStorage.getItem('BasketId') ?? '');
  }

  // ---------------- lifecycle ----------------
  ngOnInit(): void {
    // load delivery methods
    this.checkService.GetAllDeliveryMethods().subscribe(response => {
      this.deliveryMethods = response.data as IDeliveryMethod[];
    });

    // try to preload basket (optional)
    if (this.BasketId) {
      this.basketService.GetBasket().subscribe((response: any) => {
        this.basketData = response.data;
        this.calculateTotals();
      }, () => { /* ignore load errors here */ });
    }
  }
  
  ngOnDestroy(): void {
    try {
      this.cardElement?.unmount();
    } catch (e) { /* ignore */ }
  }

  // ------------------ Getters ------------------

  get fullname() { return this.shippingForm.get('fullName'); }
  get email() { return this.shippingForm.get('email'); }
  get street() { return this.shippingForm.get('street'); }
  get city() { return this.shippingForm.get('city'); }
  get postalCode() { return this.shippingForm.get('postalCode'); }
  get country() { return this.shippingForm.get('country'); }

  // ------------------ Countries List ------------------
  countries = [
    { name: 'Afghanistan' }, { name: 'Albania' }, { name: 'Algeria' },
    { name: 'Andorra' }, { name: 'Angola' }, { name: 'Antigua and Barbuda' },
    { name: 'Argentina' }, { name: 'Armenia' }, { name: 'Australia' },
    { name: 'Austria' }, { name: 'Azerbaijan' }, { name: 'Bahamas' },
    { name: 'Bahrain' }, { name: 'Bangladesh' }, { name: 'Barbados' },
    { name: 'Belarus' }, { name: 'Belgium' }, { name: 'Belize' },
    { name: 'Benin' }, { name: 'Bhutan' }, { name: 'Bolivia' },
    { name: 'Bosnia and Herzegovina' }, { name: 'Botswana' }, { name: 'Brazil' },
    { name: 'Brunei' }, { name: 'Bulgaria' }, { name: 'Burkina Faso' },
    { name: 'Burundi' }, { name: 'Cabo Verde' }, { name: 'Cambodia' },
    { name: 'Cameroon' }, { name: 'Canada' }, { name: 'Central African Republic' },
    { name: 'Chad' }, { name: 'Chile' }, { name: 'China' }, { name: 'Colombia' },
    { name: 'Comoros' }, { name: 'Congo, Democratic Republic of the' },
    { name: 'Congo, Republic of the' }, { name: 'Costa Rica' }, { name: 'Croatia' },
    { name: 'Cuba' }, { name: 'Cyprus' }, { name: 'Czech Republic' },
    { name: 'Denmark' }, { name: 'Djibouti' }, { name: 'Dominica' },
    { name: 'Dominican Republic' }, { name: 'Ecuador' }, { name: 'Egypt' },
    { name: 'El Salvador' }, { name: 'Equatorial Guinea' }, { name: 'Eritrea' },
    { name: 'Estonia' }, { name: 'Eswatini' }, { name: 'Ethiopia' }, { name: 'Fiji' },
    { name: 'Finland' }, { name: 'France' }, { name: 'Gabon' }, { name: 'Gambia' },
    { name: 'Georgia' }, { name: 'Germany' }, { name: 'Ghana' }, { name: 'Greece' },
    { name: 'Grenada' }, { name: 'Guatemala' }, { name: 'Guinea' },
    { name: 'Guinea-Bissau' }, { name: 'Guyana' }, { name: 'Haiti' },
    { name: 'Honduras' }, { name: 'Hungary' }, { name: 'Iceland' }, { name: 'India' },
    { name: 'Indonesia' }, { name: 'Iran' }, { name: 'Iraq' }, { name: 'Ireland' },
    { name: 'Israel' }, { name: 'Italy' }, { name: 'Jamaica' }, { name: 'Japan' },
    { name: 'Jordan' }, { name: 'Kazakhstan' }, { name: 'Kenya' }, { name: 'Kiribati' },
    { name: 'Korea, North' }, { name: 'Korea, South' }, { name: 'Kuwait' },
    { name: 'Kyrgyzstan' }, { name: 'Laos' }, { name: 'Latvia' }, { name: 'Lebanon' },
    { name: 'Lesotho' }, { name: 'Liberia' }, { name: 'Libya' }, { name: 'Liechtenstein' },
    { name: 'Lithuania' }, { name: 'Luxembourg' }, { name: 'Madagascar' },
    { name: 'Malawi' }, { name: 'Malaysia' }, { name: 'Maldives' }, { name: 'Mali' },
    { name: 'Malta' }, { name: 'Marshall Islands' }, { name: 'Mauritania' },
    { name: 'Mauritius' }, { name: 'Mexico' }, { name: 'Micronesia' }, { name: 'Moldova' },
    { name: 'Monaco' }, { name: 'Mongolia' }, { name: 'Montenegro' }, { name: 'Morocco' },
    { name: 'Mozambique' }, { name: 'Myanmar' }, { name: 'Namibia' }, { name: 'Nauru' },
    { name: 'Nepal' }, { name: 'Netherlands' }, { name: 'New Zealand' },
    { name: 'Nicaragua' }, { name: 'Niger' }, { name: 'Nigeria' },
    { name: 'North Macedonia' }, { name: 'Norway' }, { name: 'Oman' },
    { name: 'Pakistan' }, { name: 'Palau' }, { name: 'Panama' }, { name: 'Papua New Guinea' },
    { name: 'Paraguay' }, { name: 'Peru' }, { name: 'Philippines' }, { name: 'Poland' },
    { name: 'Portugal' }, { name: 'Qatar' }, { name: 'Romania' }, { name: 'Russia' },
    { name: 'Rwanda' }, { name: 'Saint Kitts and Nevis' }, { name: 'Saint Lucia' },
    { name: 'Saint Vincent and the Grenadines' }, { name: 'Samoa' },
    { name: 'San Marino' }, { name: 'Sao Tome and Principe' }, { name: 'Saudi Arabia' },
    { name: 'Senegal' }, { name: 'Serbia' }, { name: 'Seychelles' }, { name: 'Sierra Leone' },
    { name: 'Singapore' }, { name: 'Slovakia' }, { name: 'Slovenia' }, { name: 'Solomon Islands' },
    { name: 'Somalia' }, { name: 'South Africa' }, { name: 'Spain' }, { name: 'Sri Lanka' },
    { name: 'Sudan' }, { name: 'Suriname' }, { name: 'Sweden' }, { name: 'Switzerland' },
    { name: 'Syria' }, { name: 'Taiwan' }, { name: 'Tajikistan' }, { name: 'Tanzania' },
    { name: 'Thailand' }, { name: 'Timor-Leste' }, { name: 'Togo' }, { name: 'Tonga' },
    { name: 'Trinidad and Tobago' }, { name: 'Tunisia' }, { name: 'Turkey' },
    { name: 'Turkmenistan' }, { name: 'Tuvalu' }, { name: 'Uganda' }, { name: 'Ukraine' },
    { name: 'United Arab Emirates' }, { name: 'United Kingdom' }, { name: 'United States' },
    { name: 'Uruguay' }, { name: 'Uzbekistan' }, { name: 'Vanuatu' },
    { name: 'Vatican City' }, { name: 'Venezuela' }, { name: 'Vietnam' },
    { name: 'Yemen' }, { name: 'Zambia' }, { name: 'Zimbabwe' }
  ];

  // ------------------ Delivery Method ------------------

  selectDelivery(id: number) {
    this.deliveryForm.patchValue({ deliveryMethod: id });
    this.selectedDelivery = this.deliveryMethods.find(m => m.id === id);

    this.checkService.GetDeliveryMethodById(id).subscribe(res => {
      this.selectedDeliveryMethod = res.data as IDeliveryMethod;
      this.shippingPrice = this.selectedDeliveryMethod.price;
      this.calculateTotals();
    });
  }

  // ------------------ Steps Navigation ------------------

async nextStep() {
  if (this.activeStep === 0 && this.shippingForm.valid) {
    this.activeStep++;
    return;
  }

  if (this.activeStep === 1 && this.deliveryForm.valid) {
    this.activeStep++;

    // تحضير بيانات التحديث
    this.addBasketDto = {
      basketId: this.BasketId,
      productId: null,
      quantity: null,
      deliveryMethodId: this.deliveryForm.value.deliveryMethod,
      shippingAddress: this.shippingForm.value,
      ShipPrice: this.selectedDeliveryMethod?.price!,
      EmailBuyer: this.shippingForm.value.email
    };  

    try {
      if (!this.BasketId) {
        console.error('No basket id found');
        return;
      }

      // تحديث السلة وانتظار الانتهاء
      await firstValueFrom(this.basketService.AddItem(this.addBasketDto));

      // إنشاء PaymentIntent بعد تحديث السلة
      const payment = await firstValueFrom(this.payService.CreatePaymentIntent(this.BasketId));
      this.clientSecret = payment.clientSecret ?? '';

      // استرجاع السلة المحدثة بعد PaymentIntent
      const basketResponse = await firstValueFrom(this.basketService.GetBasket());
      this.basketData = basketResponse.data;
      console.log('Updated basket:', this.basketData);

      // إعادة حساب totals بناءً على السلة الجديدة
      this.shippingPrice = this.selectedDeliveryMethod?.price ?? 0;
      this.calculateTotals();

      // تهيئة Stripe
      await this.initializeStripe();

    } catch (err) {
      console.error('nextStep error:', err);
    }
  }
}


  prevStep() {
    if (this.activeStep > 0) this.activeStep--;
  }

  // ------------------ Country Dropdown ------------------

  filteredCountries = [...this.countries];
  showDropdown = false;

  filterCountries(value: string) {
    this.filteredCountries = this.countries.filter(c =>
      c.name.toLowerCase().includes(value.toLowerCase())
    );
  }

  selectCountry(name: string) {
    this.shippingForm.get('country')?.setValue(name);
    this.showDropdown = false;
  }

  hideDropdown() {
    setTimeout(() => this.showDropdown = false, 150);
  }

  // ------------------ Totals Calculation ------------------

  calculateTotals() {
    if (!this.basketData) return;

    this.subtotal = this.basketData.items
      .reduce((sum: number, item: Item) =>
        sum + (item.newPrice * item.quantity), 0
      );

    this.shippingPrice = this.selectedDeliveryMethod?.price ?? 0;
    this.total = this.subtotal + this.shippingPrice;
  }


 // -----------------------------------------------------
  // STRIPE INITIALIZATION
  // -----------------------------------------------------
  async initializeStripe() {
    try {
      if (!this.stripe) {
        this.stripe = await loadStripe('pk_test_51REgVVIN0VjivHeMfwSaP8D0b5jQALjnz9L1viESc0vvX9nFk5eOAQoNOlWUJKKzEJAeFzDi65vi2MhaLIyYaD0S00iKn7736w');
      }

      if (!this.stripe) {
        console.error("❌ Stripe failed to load.");
        return;
      }

      if (!this.stripeElements) {
        this.stripeElements = this.stripe.elements();
      }

      if (this.cardElement) {
        try { this.cardElement.unmount(); } catch (_) {}
        this.cardElement = null;
      }

     this.cardElement = this.stripeElements.create('card', {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: '17px',
      color: '#1a1f36',
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#a0aec0',
      },
      iconColor: '#6b7280',
    },
    invalid: {
      color: '#e53e3e',
      iconColor: '#e53e3e',
    },
    complete: {
      color: '#10b981',
      iconColor: '#10b981',
    },
  },
  classes: {
    base: 'bg-white border-2 border-slate-300 rounded-xl px-5 py-4 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all duration-300 shadow-inner',
    complete: 'border-green-500 ring-4 ring-green-500/20',
    empty: 'bg-white',
    focus: 'border-blue-600 ring-4 ring-blue-500/20',
    invalid: 'border-red-500 ring-4 ring-red-500/20',
  },
  
});
      this.cardElement.mount('#card-element');

      this.cardElement.on('change', event => {
        const errorDiv = document.getElementById('card-errors');
        if (errorDiv) errorDiv.textContent = event.error?.message ?? '';
      });

    } catch (err) {
      console.error('Stripe initialization error:', err);
    }
  }

  // -----------------------------------------------------
  // PAYMENT
  // -----------------------------------------------------
  async pay() {
    if (!this.stripe || !this.cardElement) {
      console.error('❌ Stripe/card not initialized');
      return;
    }

    if (!this.clientSecret) {
      console.error('❌ Missing clientSecret');
      return;
    }

    const result: PaymentIntentResult = await this.stripe.confirmCardPayment(
      this.clientSecret,
      {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: this.shippingForm.value.fullName,
            email: this.shippingForm.value.email
          }
        }
      }
    );

    if (result.error) {
      const errDiv = document.getElementById('card-errors');
      if (errDiv) errDiv.textContent = result.error.message ?? '';
      return;
    }

    if (result.paymentIntent?.status === 'succeeded') {
      const order: OrderDto = {
        basketId: this.BasketId,
        shippingAddress: this.shippingForm.value,
        deleiveryMethodId: this.deliveryForm.value.deliveryMethod
      };

      this.checkService.CreateOrder(order).subscribe((res) => {
        console.log(res);
        console.log('Order created successfully');
       this.router.navigate(['/checkout-success', res.id]);
       this.basketService.ClrearBasket().subscribe(() => {});

      });
    }
  }
  }

