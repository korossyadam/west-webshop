import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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
   getName = this.utilsService.getName;
   getEmail = this.utilsService.getEmail;
   showSnackBar = this.utilsService.openSnackBar;
   
   public cartItems = [];
   public total: number;

   public searchedText: string;

   constructor(private utilsService: UtilsService, private authService: AuthService, private route: Router) { }

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

   searchForProduct(searchedText): void {
      const minimumLength = 3;

      if (searchedText.length <= minimumLength) {
         this.showSnackBar('A keresett szövegnek minimum ' + minimumLength + ' karakternek kell lennie!', 'Bezárás', 4000);
      } else {
         this.route.navigateByUrl('/products;partNumber=' + searchedText);
      }
   }

   logOut(): void {
      this.authService.logout();
   }

}
