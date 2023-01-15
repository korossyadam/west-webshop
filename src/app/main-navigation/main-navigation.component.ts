import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Category, UtilsService } from '../services/utils.service';

@Component({
   selector: 'app-main-navigation',
   templateUrl: './main-navigation.component.html',
   styleUrls: ['./main-navigation.component.css'],
})
export class MainNavigationComponent implements OnInit {

   // Static functions
   companyPhoneNumber = this.utilsService.companyPhoneNumber;
   companyEmail = this.utilsService.companyEmail;
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

   // Product categories
   public categories: Category[] = [];

   // Cart variables
   public cartItems = [];
   public total: number = 0;

   constructor(private utilsService: UtilsService, private authService: AuthService, private route: Router) { }

   ngOnInit(): void {

      // Get categories from JSON tree
      this.utilsService.getCategories().then(categories => {
         this.categories = categories;
      });

      // Get cartItems
      this.utilsService.cartUpdated.subscribe(newCartData => {
         this.cartItems = newCartData;
         this.total = this.calculateTotal();
      })

      this.refreshCart();
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

   /**
    * Navigate to product list with searchedText parameter from search bar
    * No navigation happens in case searchedText does not exceed minimum character requirement
    * 
    * @param searchedText The text extracted from search bar
    */
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
