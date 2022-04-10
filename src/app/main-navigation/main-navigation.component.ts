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

   value = "";
   public searchedText: string;
   public searchedSomething: boolean = false;

   isIf: boolean;

   constructor(private authService: AuthService, private changeDetectorRef: ChangeDetectorRef) { }

   ngOnInit(): void {
      this.cartItems = [];

      var parts: string[] = localStorage.getItem('cart')?.split('/')!;
      for(var i = 0; i < parts.length; i++){
         var attributes = parts[i].split('!');
         var product: Product = new Product(attributes[0], attributes[1], '', attributes[2], parseInt(attributes[3]), [], [], [], JSON.parse(attributes[4]), [attributes[5]]);
         this.cartItems.push(product);
      }

      // PLACEHOLDER
      var imgurl: string[] = ['https://ic-files-res.cloudinary.com/image/upload/v1/item/i9gyjzcudo3yria8eoir.jpg'];
      var imgurl2: string[] = ['https://ic-files-res.cloudinary.com/image/upload/v1/item/afqdizxnrofc202wjcqa.jpg'];

      this.cartItems = [];
      var p1 = new Product("CU40110", 'Légszűrő', 'desc', 'brand', 2000, [], [], [], false, imgurl)
      this.cartItems.push(p1);
      var p2 = new Product("F142-A", 'Kalapács', 'desc', 'brand', 212, [], [], [], false, imgurl2)
      this.cartItems.push(p2);
      var p3 = new Product("AARM.S14.12", 'Xenon Fényszóró', 'desc', 'brand', 259251, [], [], [], true, imgurl)
      this.cartItems.push(p3);
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

   deleteCartItem(index: number){

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

}
