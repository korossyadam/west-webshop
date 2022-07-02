import { ChangeDetectorRef, Component, ContentChild, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Product } from '../models/product.model';
import { ProductsComponent } from '../products/products.component';
import { AuthService } from '../services/auth.service';

@Component({
   selector: 'app-main-navigation',
   templateUrl: './main-navigation.component.html',
   styleUrls: ['./main-navigation.component.css'],
})
export class MainNavigationComponent implements OnInit {

   public step: number = 0;
   public secondHover: number = -1;
   public thirdHover: number = -1;

   @Output() carSelectClickedEvent = new EventEmitter<boolean>();
   @ViewChild(ProductsComponent) child: ProductsComponent;

   cartItems: Product[];
   cartItemsAmount: number[];
   subtotal: string = '';
   subtotalNet: string = '';

   value = "";
   public searchedText: string;
   public searchedSomething: boolean = false;

   isIf: boolean;

   constructor(private authService: AuthService, private changeDetectorRef: ChangeDetectorRef) { }

   ngOnInit(): void {
      this.cartItems = [];
      this.cartItemsAmount = [];

      var localStorageCart = localStorage.getItem('cart');
      var parts: string[] = localStorageCart?.split('/')!;

      var total = 0;
      if (parts[0] != 'undefined' && localStorageCart !== '') {

         for (var i = 0; i < parts.length; i++) {
            var attributes = parts[i].split('!');

            var actualPrice = parseInt(attributes[3]) * this.cartItemsAmount[i];

            // Convert number to string
            var price = this.formatPriceToString(actualPrice);

            var product: Product = new Product(attributes[0], attributes[1], '', attributes[2], price, [], [], [], JSON.parse(attributes[4]), [attributes[5]]);
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
      var p1 = new Product("CU40110", 'Légszűrő', 'desc', 'YATO', '2.525 Ft', [], [], [], false, imgurl)
      this.cartItems.push(p1);
      this.cartItemsAmount.push(2);
      var p2 = new Product("F142-A", 'Kalapács', 'desc', 'FILTRON', '195 Ft', [], [], [], false, imgurl2)
      this.cartItems.push(p2);
      this.cartItemsAmount.push(1);
      var p3 = new Product("AARM.S14.12", 'Xenon Fényszóró', 'desc', 'MANN-FILTER', '259.900 Ft', [], [], [], true, imgurl)
      this.cartItems.push(p3);
      this.cartItemsAmount.push(19);
      this.subtotal = '74.265 Ft';
      this.subtotalNet = '58.476 Ft';
      // PLACEHOLDER

   }

   updatChildIf(): void {
      this.isIf = !this.isIf;
      this.changeDetectorRef.detectChanges();
      console.log("child", this.child);
      if (localStorage.getItem('user') == null) { }
   }

   onSearch(): void {
      this.searchedSomething = true;
      this.child.search()
   }

   onCarSelectorButtonClick(): void {
      this.carSelectClickedEvent.emit(true);
   }

   deleteCartItem(index: number) {

   }

   localStorageUser(): string {
      var currentUser = localStorage.getItem('user');
      if (currentUser != null) {
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
      var firstName = localStorage.getItem('firstName')
      return lastName + ' ' + firstName;
   }

   getEmail(): string {
      var email = localStorage.getItem('email');
      if (email != null)
         return email;
      else
         return '';
   }

   formatPriceToString(total: number): string {
      var returnString = '';

      if (total < 999)
         returnString = total + ' Ft';
      else if (total < 9999)
         returnString = total.toString().substring(0, 1) + ' ' + total.toString().substring(1, total.toString().length) + ' Ft';
      else if (total < 99999)
         returnString = total.toString().substring(0, 2) + ' ' + total.toString().substring(2, total.toString().length) + ' Ft';
      else if (total < 999999)
         returnString = total.toString().substring(0, 3) + ' ' + total.toString().substring(3, total.toString().length) + ' Ft';

      return returnString;
   }

}
