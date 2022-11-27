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
   //@ViewChild(ProductsComponent) child: ProductsComponent;

   // Static functions
   addTax = this.utilsService.addTaxToPrice;
   formatPriceToString = this.utilsService.formatPriceToString;
   sanitize = this.utilsService.sanitize;

   public step: number = 0;
   public secondHover: number = -1;
   public thirdHover: number = -1;

   public cartItems = [];
   subtotal: string = '';
   subtotalNet: string = '';

   value = "";
   public searchedText: string;

   isIf: boolean;

   constructor(private utilsService: UtilsService, private authService: AuthService, private changeDetectorRef: ChangeDetectorRef) { }

   ngOnInit(): void {
      this.cartItems = [];

      this.fillCart();

      /*
      var localStorageCart = localStorage.getItem('cart');

      if (localStorageCart != null) {
         var parts: string[] = localStorageCart?.split('/')!;

         var total = 0;
         if (parts[0] != 'undefined' && localStorageCart !== '') {

            for (var i = 0; i < parts.length; i++) {
               var attributes = parts[i].split('!');

               var actualPrice = parseInt(attributes[3]) * this.cartItemsAmount[i];

               // Convert number to string
               var price = this.formatPriceToString(actualPrice);

               var product: Product = new Product(attributes[0], attributes[1], '', [], attributes[2], price, [], [], JSON.parse(attributes[4]), [attributes[5]], []);
               this.cartItems.push(product);
               this.cartItemsAmount.push(parseInt(attributes[6]));
               total += actualPrice;
            }
         }

         // Subtotal formatting
         this.subtotal = this.formatPriceToString(total);
         this.subtotalNet = this.formatPriceToString(total / 1.27);


         // PLACEHOLDER
         var imgurl: string[] = ['https://ic-files-res.cloudinary.com/image/upload/v1/item/i9gyjzcudo3yria8eoir.jpg'];
         var imgurl2: string[] = ['https://ic-files-res.cloudinary.com/image/upload/v1/item/afqdizxnrofc202wjcqa.jpg'];

         this.cartItems = [];
         var p1 = new Product("CU40110", 'Légszűrő', 'desc', [], 'YATO', '2.525 Ft', [], [], false, imgurl, []);
         this.cartItems.push(p1);
         this.cartItemsAmount.push(2);
         var p2 = new Product("F142-A", 'Kalapács', 'desc', [], 'FILTRON', '195 Ft', [], [], false, imgurl2, []);
         this.cartItems.push(p2);
         this.cartItemsAmount.push(1);
         var p3 = new Product("AARM.S14.12", 'Xenon Fényszóró', 'desc', [], 'MANN-FILTER', '259.900 Ft', [], [], true, imgurl, []);
         this.cartItems.push(p3);
         this.cartItemsAmount.push(19);
         this.subtotal = '74.265 Ft';
         this.subtotalNet = '58.476 Ft';
         // PLACEHOLDER
         
      }*/



   }

   /**
    * Populates cartItems array from localStorage
    */
   fillCart(): void {
      this.cartItems = [];

      let localStorageCart = localStorage.getItem('cart');
      if(localStorageCart) {
         this.cartItems = JSON.parse(localStorageCart);
      }

   }

   /*
   updatChildIf(): void {
      this.isIf = !this.isIf;
      this.changeDetectorRef.detectChanges();
      console.log("child", this.child);
      if (localStorage.getItem('user') == null) { }
   }

   onSearch(): void {
      this.child.search();
   }
   */

   onCarSelectorButtonClick(): void {
      this.carSelectClickedEvent.emit(true);
   }

   deleteCartItem(index: number) {

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
