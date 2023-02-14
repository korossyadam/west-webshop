import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '../services/utils.service';

@Component({
   selector: 'app-cart',
   templateUrl: './cart.component.html',
   styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {

   // Static variables
   globalCartItems = this.utilsService.cartItems;

   // Static functions
   refreshCart = this.utilsService.refreshCart;
   calculateTotal = this.utilsService.calculateTotal;
   addTax = this.utilsService.addTaxToPrice;
   formatPriceToString = this.utilsService.formatPriceToString;
   sanitize = this.utilsService.sanitize;
   getUserId = this.utilsService.getUserId;
   showSnackBar = this.utilsService.openSnackBar;

   // Form group is passed to child components
   form: FormGroup;

   public cartItems = [];
   public shippingPrice: number = 0;
   public total: number = 0;
   public shippingMethod: string = 'Személyes átvétel';
   public paymentMethod: string = 'Előre utalás';

   // Radio button values
   public isShippingChecked: boolean = false;
   public isCashPaymentChecked: boolean = false;

   constructor(private utilsService: UtilsService, private _formBuilder: FormBuilder) { }

   ngOnInit(): void {
      this.form = this._formBuilder.group({
         name: [this.utilsService.getName(), Validators.required],
         email: [this.utilsService.getEmail(), Validators.required],
         phone: [this.utilsService.getPhoneNumber(), Validators.required],
         zip: [this.utilsService.getZip(), Validators.required],
         city: [this.utilsService.getCity(), Validators.required],
         street: [this.utilsService.getStreet(), Validators.required],
         comment: [''],
         invoiceName: [''],
         invoiceZip: [''],
         invoiceCity: [''],
         invoiceStreet: [''],
         taxNumber: [''],
         sameAsShippingAddress: [true]
      });

      this.utilsService.cartUpdated.subscribe(newCartData => {
         this.cartItems = newCartData;
      });

      this.refreshCart();
   }

   setTotal(total: number): void {
      this.total = total;
   }

   setShippingPrice(shippingPrice: number): void {
      this.shippingPrice = shippingPrice;
   }

   setShippingMethod(shippingMethod: string): void {
      this.shippingMethod = shippingMethod;
   }

   setPaymentMethod(paymentMethod: string): void {
      this.paymentMethod = paymentMethod;
   }
}
