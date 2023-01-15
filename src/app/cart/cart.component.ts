import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Order, ShippingAddress, BillingAddress, OrderedProduct } from '../models/order.model';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { UtilsService } from '../services/utils.service';

@Component({
   selector: 'app-cart',
   templateUrl: './cart.component.html',
   styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {

   firstFormGroup: FormGroup;
   secondFormGroup: FormGroup;

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

   public cartItems = [];
   public deliveryPrice: number = 0;
   public total: number = 0;

   // Radio button values
   public isShippingChecked: boolean = false;
   public isCashPaymentChecked: boolean = false;

   // If this variable is true, a loading spinner is displayed on first section
   public initialLoading: boolean = true;

   // Variables filled out by user
   public name: string;
   public email: string;
   public phoneNumber: string;
   public deliveryPostalCode: string;
   public deliveryCity: string;
   public deliveryStreet: string;
   public comment: string;
   public invoiceName: string;
   public invoicePostalCode: string;
   public invoiceCity: string;
   public invoiceStreet: string;
   public taxNumber: string;

   constructor(private utilsService: UtilsService, private cartService: CartService, private _formBuilder: FormBuilder, public dialog: MatDialog) { }

   ngOnInit(): void {
      this.firstFormGroup = this._formBuilder.group({
         radioGroupControl: ['', Validators.required],
      });
      this.secondFormGroup = this._formBuilder.group({
         secondCtrl: ['', Validators.required],
      });

      this.utilsService.cartUpdated.subscribe(newCartData => {
         this.cartItems = newCartData;
         this.calculateTotalWithShipping();
         
      })

      this.refreshCart();
      this.disableInitialLoading();
   }

   /**
    * Disables mat-spinner after a set time (ex.: 1000 ms)
    */
   async disableInitialLoading(): Promise<void> {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.initialLoading = false;
   }

   /**
    * Calculates the total of the order
    * Needs to be re-calculated every time the cart changes (including shipping and payment info)
    */
   calculateTotalWithShipping(): number {
      this.deliveryPrice = 0;
      this.total = 0;

      // Calculate total price of all products to be ordered
      for (let i = 0; i < this.cartItems.length; i++) {
         this.total += this.cartItems[i].price * this.cartItems[i].quantity;
      }

      // Add shipping costs
      if (this.isShippingChecked)
         this.deliveryPrice += 1990;
      if (this.isCashPaymentChecked)
         this.deliveryPrice += 390;

      this.total += this.deliveryPrice;

      return this.total;
   }

   /**
   * Increments the cart button value by 1
   * Does not increment if incremented value would be higher than the avaible product stock
   * 
   * @param inputId The ID of the input we need to change the value of
   * @param cartIndex The index of the product that we are changing the quantity of (in cartItems[] array)
   */
   incrementInputValue(inputId: string, cartIndex: number): void {
      let element = (<HTMLInputElement>document.getElementById(inputId));
      if (parseInt(element.value) >= 7)
         return;

      // Increment input value
      element.value = (parseInt(element.value) + 1).toString();

      // Update JSON is localStorage
      this.cartItems = JSON.parse(localStorage.getItem('cart'));
      this.cartItems[cartIndex].quantity += 1;
      localStorage.setItem('cart', JSON.stringify(this.cartItems));

      // Emit event to utilsService
      this.refreshCart();
      this.utilsService.cartUpdated.emit(this.cartItems);
   }

   /**
    * Decrements the cart button value by 1
    * Does not decrement if decremented value would be lower than 1
    * 
    * @param inputId The ID of the input we need to change the value of
    * @param cartIndex The index of the product that we are changing the quantity of (in cartItems[] array)
    */
   decrementInputValue(inputId: string, cartIndex: number): void {
      let element = (<HTMLInputElement>document.getElementById(inputId));
      if (parseInt(element.value) <= 1)
         return;

      // Decrement input value
      element.value = (parseInt(element.value) - 1).toString();

      // Update JSON is localStorage
      this.cartItems = JSON.parse(localStorage.getItem('cart'));
      this.cartItems[cartIndex].quantity -= 1;
      localStorage.setItem('cart', JSON.stringify(this.cartItems));

      // Emit event to utilsService
      this.refreshCart();
      this.utilsService.cartUpdated.emit(this.cartItems);
   }

   /**
    * Deletes an item from the cart
    * Modifies both cartItems[], and localStorage cart
    * 
    * @param index The index of the Product to remove in cartItems[]
    */
   deleteCartItem(index: number): void {
      this.cartItems.splice(index, 1);
      this.calculateTotal();

      localStorage.setItem('cart', JSON.stringify(this.cartItems));

      // Emit event to utilsService
      this.refreshCart();
      this.utilsService.cartUpdated.emit(this.cartItems);
   }

   /**
    * Changes the display of 'Tax Number' input field
    * 'height: 0px' used instead of 'display: none' for smoother animations
    * 
    * @param event Whether the checkbox is checked or not
    */
   showTaxNumberFields(event: MatCheckboxChange): void {
      let container = <HTMLInputElement>document.getElementsByClassName('tax-number-container')[0];

      if (event.checked) {
         container.style.height = '46px';
      } else {
         container.style.height = '0px';
      }

      // Open invoice fields since Tax Number field is in invoice fields
      this.showInvoiceFields();
   }

   /**
    * Open up invoice input fields
    */
   showInvoiceFields(): void {
      let container = <HTMLInputElement>document.getElementsByClassName('invoice-container')[0];
      container.style.height = '160px';
   }

   /**
    * Changes the display of invoice input fields
    * 'height: 0px' used instead of 'display: none' for smoother animations
    * 
    * @param event Whether the checkbox is checked or not
    */
   changeInvoiceFieldsDisplay(event: MatCheckboxChange): void {
      let container = <HTMLInputElement>document.getElementsByClassName('invoice-container')[0];

      if (!event.checked) {
         container.style.height = '160px';
      } else {
         container.style.height = '0px';
      }
   }

   setUserInfo(name: string, email: string, phoneNumber: string, deliveryPostalCode: string, deliveryCity: string, deliveryStreet: string, comment: string,
      invoiceName: string, invoicePostalCode: string, invoiceCity: string, invoiceStreet: string, taxNumber: string): void {
      this.name = name;
      console.log(this.name);
      this.email = email;
      this.phoneNumber = phoneNumber;
      this.deliveryPostalCode = deliveryPostalCode;
      this.deliveryCity = deliveryCity;
      this.deliveryStreet = deliveryStreet;
      this.comment = comment;
      this.invoiceName = invoiceName;
      this.invoicePostalCode = invoicePostalCode;
      this.invoiceCity = invoiceCity;
      this.invoiceStreet = invoiceStreet;
      this.taxNumber = taxNumber;
   }

   /**
    * Creates a new Order instance based on user input, and uploads it to Firestore
    */
   finalizeOrder(): void {

      // Custom object for shipping address
      let shippingAddress: ShippingAddress = {
         name: this.name,
         email: this.email,
         phoneNumber: this.phoneNumber,
         address: this.deliveryPostalCode + ', ' + this.deliveryCity + ', ' + this.deliveryStreet,
         comment: this.comment,
      };
      
      // Custom object for billing address
      let billingAddress: BillingAddress = {
         name: this.invoiceName,
         address: this.invoicePostalCode + ', ' + this.invoiceCity + ', ' + this.invoiceStreet,
         taxNumber: this.taxNumber,
      };

      // Fill Order with OrderedProducts
      let orderedProducts: OrderedProduct[] = [];
      for (let cartItem of this.cartItems) {
         orderedProducts.push({ partNumber: cartItem.partNumber, name: cartItem.name, brand: cartItem.brand, price: cartItem.price, quantity: cartItem.quantity, imgurl: cartItem.imgurls[0]})
      }

      // Stringify shipping and payment methods
      let shippingMethod = 'Személyes átvétel';
      if (this.isShippingChecked) {
         shippingMethod = 'Házhozszállítás'
      }

      let paymentMethod = 'Előre utalás';
      if (this.isCashPaymentChecked) {
         paymentMethod = 'Utánvét';
      }

      // Re-calculate total price
      this.calculateTotal();

      let newOrder: Order = new Order(this.getUserId(), new Date(), this.deliveryPrice, this.total, orderedProducts, shippingAddress, billingAddress, shippingMethod, paymentMethod);

      this.cartService.addOrder(Object.assign({}, newOrder)).then(res => {
         this.showSnackBar('Sikeres rendelés!', 'Bezárás', 5000);
      })

   }

}
