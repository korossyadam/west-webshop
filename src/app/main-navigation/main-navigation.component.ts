import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
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
   refreshCart = this.utilsService.refreshCart;
   calculateTotal = this.utilsService.calculateTotal;
   deleteCartItem = this.utilsService.deleteCartItem;
   addTax = this.utilsService.addTaxToPrice;
   formatPriceToString = this.utilsService.formatPriceToString;
   sanitize = this.utilsService.sanitize;
   getName = this.utilsService.getName;
   getEmail = this.utilsService.getEmail;
   showSnackBar = this.utilsService.openSnackBar;
   
   public searchedText: string;

   public ob = of(this.utilsService.cartItems);
   public cartItems = [];
   public total = 0;

   constructor(private utilsService: UtilsService, private authService: AuthService, private route: Router) { }

   ngOnInit(): void {
      this.utilsService.cartUpdated.subscribe(newCartData => {
         this.cartItems = newCartData;
         this.total = this.calculateTotal();
      })

      this.refreshCart();
   }

   /**
    * Calls the sidenav's open() method
    */
   onCarSelectorButtonClick(): void {
      this.carSelectClickedEvent.emit(true);
   }

   searchForProduct(searchedText): void {
      const minimumLength = 3;

      if (searchedText.length < minimumLength) {
         this.showSnackBar('A keresett szövegnek minimum ' + minimumLength + ' karakternek kell lennie!', 'Bezárás', 4000);
      } else {
         this.route.navigateByUrl('/products;partNumber=' + searchedText);
      }
   }

   logOut(): void {
      this.authService.logout();
   }

}
