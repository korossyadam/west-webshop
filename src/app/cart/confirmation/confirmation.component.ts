import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BillingAddress, Order, OrderedProduct, ShippingAddress } from 'src/app/models/order.model';
import { CartService } from 'src/app/services/cart.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  // Static functions
  refreshCart = this.utilsService.refreshCart;
  calculateTotal = this.utilsService.calculateTotal;
  addTax = this.utilsService.addTaxToPrice;
  formatPriceToString = this.utilsService.formatPriceToString;
  sanitize = this.utilsService.sanitize;
  getUserId = this.utilsService.getUserId;
  showSnackBar = this.utilsService.openSnackBar;

  // Data coming from parent component
  @Input() cartItems = [];
  @Input() form: FormGroup;
  @Input() shippingPrice: number;
  @Input() total: number;
  @Input() shippingMethod: string;
  @Input() paymentMethod: string;

  constructor(private utilsService: UtilsService, private cartService: CartService) { }

  ngOnInit(): void {}

  /**
    * Creates a new Order instance based on user input, and uploads it to Firestore
    */
  finalizeOrder(): void {

    // Custom object for shipping address
    let shippingAddress: ShippingAddress = {
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      phoneNumber: this.form.controls.phone.value,
      address: this.form.controls.zip.value + ', ' + this.form.controls.city.value + ', ' + this.form.controls.street.value,
      comment: this.form.controls.comment.value,
    };

    // Custom object for billing address
    let billingAddress: BillingAddress = {
      name: this.form.controls.invoiceName.value,
      address: this.form.controls.invoiceZip.value + ', ' + this.form.controls.invoiceCity.value+ ', ' + this.form.controls.invoiceStreet.value,
      taxNumber: this.form.controls.taxNumber.value,
    };

    // Fill Order with OrderedProducts
    let orderedProducts: OrderedProduct[] = [];
    for (let cartItem of this.cartItems) {
      orderedProducts.push({ partNumber: cartItem.partNumber, name: cartItem.name, brand: cartItem.brand, price: cartItem.price, quantity: cartItem.quantity, imgurl: cartItem.imgurls[0] });
    }

    // Re-calculate total price
    this.calculateTotal();

    let newOrder: Order = new Order(this.getUserId(), new Date(), this.shippingPrice, this.total, orderedProducts, shippingAddress, billingAddress, this.shippingMethod, this.paymentMethod);
    this.cartService.addOrder(Object.assign({}, newOrder)).then(() => {
      this.showSnackBar('Sikeres rendelés!', 'Bezárás', 5000);
    });

  }

}
