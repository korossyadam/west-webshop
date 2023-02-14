import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  // Static functions
  refreshCart = this.utilsService.refreshCart;
  calculateTotal = this.utilsService.calculateTotal;
  addTax = this.utilsService.addTaxToPrice;
  formatPriceToString = this.utilsService.formatPriceToString;
  sanitize = this.utilsService.sanitize;

  // Data coming from parent component
  @Input() cartItems = [];

  // Data sent to parent component
  @Output() shippingPriceEvent = new EventEmitter<number>();
  @Output() totalEvent = new EventEmitter<number>();
  @Output() shippingEvent = new EventEmitter<string>();
  @Output() paymentEvent = new EventEmitter<string>();

  // Prices
  public shippingPrice: number = 0;
  public total: number = 0;

  // Radio button values
  public isShippingChecked: boolean = false;
  public isCashPaymentChecked: boolean = false;

  // If this variable is true, a loading spinner is displayed on first section
  public initialLoading: boolean = true;

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.calculateTotalWithShipping();
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
    this.shippingPrice = 0;
    this.total = 0;

    // Calculate total price of all products to be ordered
    for (let i = 0; i < this.cartItems.length; i++) {
      this.total += this.cartItems[i].price * this.cartItems[i].quantity;
    }

    // Add shipping costs
    if (this.isShippingChecked) {
      this.shippingPrice += 1990;
      this.shippingEvent.emit('Házhozszállítás');
    } if (this.isCashPaymentChecked) {
      this.shippingPrice += 390;
      this.shippingEvent.emit('Utánvét');
    }

    this.total += this.shippingPrice;
    this.totalEvent.emit(this.total);
    this.shippingPriceEvent.emit(this.shippingPrice);

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

}
