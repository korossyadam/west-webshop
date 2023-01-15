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

   // Static functions
   categories = this.utilsService.categories;
   companyPhoneNumber = this.utilsService.companyPhoneNumber;
   companyEmail = this.utilsService.companyEmail;
   createCategories = this.utilsService.getCategories;
   refreshCart = this.utilsService.refreshCart;
   calculateTotal = this.utilsService.calculateTotal;
   deleteCartItem = this.utilsService.deleteCartItem;
   addTax = this.utilsService.addTaxToPrice;
   formatPriceToString = this.utilsService.formatPriceToString;
   sanitize = this.utilsService.sanitize;
   getName = this.utilsService.getName;
   getEmail = this.utilsService.getEmail;
   showSnackBar = this.utilsService.openSnackBar;
   openCarSelectorSidenav = this.utilsService.openCarSelectorSidenav;
   openMobileSidenav = this.utilsService.openMobileSidenav;
   
   public searchedText: string;

   public cartItems = [];
   public total = 0;

   constructor(private utilsService: UtilsService, private authService: AuthService, private route: Router) { }

   ngOnInit(): void {
      this.utilsService.cartUpdated.subscribe(newCartData => {
         this.cartItems = newCartData;
         this.total = this.calculateTotal();
      })

      this.refreshCart();

      this.createCategories().then(res => {
         console.log(this.categories);
      });
   }

   /**
    * Emits an event through utilsService to open the car selector sidenav
    */
   onCarSelectorButtonClick(): void {
      if (this.getEmail() == '') {
         this.showSnackBar('Ennek a funkciónak a használatához be kell jelentkezned!', 'Bezárás', 4000);
      } else {
         this.openCarSelectorSidenav();
      }
   }

   /**
    * Emits an event through utilsService to open the mobile sidenav
    */
   onMobileMenuButtonClick(): void {
      this.openMobileSidenav();
   }

   searchForProduct(searchedText: string): void {
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
