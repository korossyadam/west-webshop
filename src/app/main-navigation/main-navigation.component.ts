import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product } from '../models/product.model';
import { AuthService } from '../services/auth.service';
import { UtilsService } from '../services/utils.service';

@Component({
   selector: 'app-main-navigation',
   templateUrl: './main-navigation.component.html',
   styleUrls: ['./main-navigation.component.css'],
})
export class MainNavigationComponent implements OnInit {

   @Output() carSelectClickedEvent = new EventEmitter<boolean>();

   // Static functions
   addTax = this.utilsService.addTaxToPrice;
   formatPriceToString = this.utilsService.formatPriceToString;
   sanitize = this.utilsService.sanitize;

   public cartItems = [];
   public total: number;

   public searchedText: string;

   constructor(private utilsService: UtilsService, private authService: AuthService) { }

   ngOnInit(): void {
      this.fillCart();
   }

   /**
    * Populates cartItems array from localStorage
    */
   fillCart(): void {
      this.cartItems = [];
      this.total = 0;

      let localStorageCart = localStorage.getItem('cart');
      if (localStorageCart) {
         this.cartItems = JSON.parse(localStorageCart);
      }

      this.calculateTotal();
   }

   /**
    * Calls the sidenav's open() method
    */
   onCarSelectorButtonClick(): void {
      this.carSelectClickedEvent.emit(true);
   }

   /**
    * Calculates the total of the order
    * Needs to be re-calculated every time the cart changes
    */
    calculateTotal(): void {
      this.total = 0;
      for (let i = 0; i < this.cartItems.length; i++) {
         this.total += this.cartItems[i].price * this.cartItems[i].quantity;
      }
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
   }

   localStorageUser(): string {
      var currentUser = localStorage.getItem('user');
      if(currentUser != null) {
         return currentUser;
      } else {
         return '';
      }
   }

   logOut(): void {
      this.authService.logout();
   }

   getName(): string {
      var lastName = localStorage.getItem('lastName');
      var firstName = localStorage.getItem('firstName');
      return lastName + ' ' + firstName;
   }

   getEmail(): string {
      var email = localStorage.getItem('email');
      if(email != null)
         return email;
      else
         return '';
   }

}
