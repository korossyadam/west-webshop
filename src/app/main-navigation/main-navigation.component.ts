import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Category, UtilsService } from '../services/utils.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';

class DisplayedCategory {
   prefix: string;
   suffix: string;
}

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
   getLeafNodePaths = this.utilsService.getLeafNodePaths;

   // Product categories
   public categories: Category[] = [];
   public categoryPaths: string[] = [];

   // The one product that appears below searchbar when the exact partNumbers match
   public displayedProduct: Product;

   public displayedCategories: DisplayedCategory[];

   // This variable represents the text inside the search input
   public searchField: string;

   // Cart variables
   public cartItems = [];
   public total: number = 0;

   constructor(private utilsService: UtilsService, private authService: AuthService, private router: Router, private productsService: ProductsService) { }

   ngOnInit(): void {

      // Get categories from JSON tree
      this.utilsService.getCategories().then(categories => {
         this.categories = categories;
         this.categoryPaths = this.getLeafNodePaths(categories);
      });

      // Get cartItems
      this.utilsService.cartUpdated.subscribe(newCartData => {
         this.cartItems = newCartData;
         this.total = this.calculateTotal();
      });

      fromEvent(document.getElementById('searchField'), 'input')
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.getProductsFromDb();
      });

      this.refreshCart();
   }

   getProductsFromDb(): void {
      console.log(this.searchField);
      this.productsService.getProduct(this.searchField).subscribe(res => {
         if (res.length == 0)
            return;

         this.displayedProduct = res[0];
      })
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

   lookForCategories(): void {
      this.displayedCategories = [];
      if (this.searchField.length < 2)
         return;

      for (const categoryPath of this.categoryPaths) {
         if (categoryPath.toLowerCase().includes(this.searchField.toLowerCase())) {
            let parts = categoryPath.split('/');
            let suffix = parts[parts.length-1];
            let prefix = parts.slice(0, -1).join(' / ');
            this.displayedCategories.push({prefix: prefix, suffix: suffix});
         }
      }

   }

   jumpToCategory(clickedCategory: DisplayedCategory): void {
      this.router.navigate(['/products/' + clickedCategory.suffix.trim()]);
   }

   /**
    * Navigate to product list with searchedText parameter from search bar
    * No navigation happens in case searchedText does not exceed minimum character requirement
    */
   searchForProduct(): void {
      const minimumLength = 3;

      if (this.searchField.length < minimumLength) {
         this.showSnackBar('A keresett szövegnek minimum ' + minimumLength + ' karakternek kell lennie!', 'Bezárás', 4000);
      } else {
         this.router.navigateByUrl('/products;partNumber=' + this.searchField);
      }
   }

   logOut(): void {
      this.authService.logout();
   }

}
