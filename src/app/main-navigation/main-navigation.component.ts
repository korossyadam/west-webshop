import { ChangeDetectorRef, Component, ContentChild, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';
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

   value = "";
   public searchedText: string;
   public searchedSomething: boolean = false;

   isIf: boolean;

   constructor(private authService: AuthService, private changeDetectorRef: ChangeDetectorRef) { }

   ngOnInit(): void { }

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
