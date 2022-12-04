import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { first, Timestamp } from 'rxjs';
import { Address } from '../models/address.model';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { UtilsService } from '../services/utils.service';

@Component({
   selector: 'app-profile',
   templateUrl: './profile.component.html',
   styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

   // Static functions
   addTax = this.utilsService.addTaxToPrice;
   formatPriceToString = this.utilsService.formatPriceToString;
   sanitize = this.utilsService.sanitize;
   getName = this.utilsService.getName;
   getEmail = this.utilsService.getEmail;
   getZip = this.utilsService.getZip;
   getCity = this.utilsService.getCity;
   getStreet = this.utilsService.getStreet;
   getTaxNumber = this.utilsService.getTaxNumber;
   getPhoneNumber = this.utilsService.getPhoneNumber;
   showSnackBar = this.utilsService.openSnackBar;

   @ViewChild('dialogRef') dialogRef!: TemplateRef<any>;

   public currentUser: User;
   public orders: Order[];

   public step: number = 0;

   constructor(private utilsService: UtilsService, private route: ActivatedRoute, private profileService: ProfileService, private dialog: MatDialog) { }

   ngOnInit(): void {
      this.step = parseInt(this.route.snapshot.paramMap.get('tab'));

      this.profileService.getCurrentUser().pipe(first()).subscribe(data => this.currentUser = data[0]);

      this.profileService.getCurrentUserOrders().subscribe(data => {
         this.orders = data;
      });
   }

   /**
    * This function updates the current user's data
    * 
    * @param name The new name
    * @param phoneNumber The new phone number
    */
   updateBasicUserInfo(name: string, phoneNumber: string): void {
      this.profileService.updateCurrentUser(name, phoneNumber).then(res => {
         this.showSnackBar('Sikeres adatváltoztatás!', 'Bezárás', 4000);
      });
   }

   /**
    * This function updates the current user's address data
    * 
    * @param zip The new zip code
    * @param city The new city
    * @param street The new street (with house number)
    * @param taxNumber The new tax number
    */
   updateUserAddress(zip: string, city: string, street: string, taxNumber: string): void {
      let newAddress: Address = new Address(zip, city, street, taxNumber);
      this.profileService.updateCurrentUserAddress(Object.assign({}, newAddress)).then(res => {
         this.showSnackBar('Sikeres adatváltoztatás!', 'Bezárás', 4000);
      })
   }

   /**
    * Removes a Product from the current user's wishlist
    * Removes it from the database and if successful, removes it from the local variable
    * 
    * @param productToRemove The Product to remove
    */
   removeWishListProduct(productToRemove: Product): void {
      this.profileService.removeFromWishList(productToRemove).then(res => {
         
         // Remove the product from wishlist locally
         const index = this.currentUser.wishList.indexOf(productToRemove, 0);
         if (index > -1) {
            this.currentUser.wishList.splice(index, 1);
         }

         this.showSnackBar('Termék sikeresen eltávolítva!', 'Bezárás', 4000);
      });
   }

   // Add a new Address to current User
   saveAddress(name: string, email: string, lastName: string, firstName: string, companyName: string, companyTax: string, phone: string, zip: string, city: string, street: string): void {
      this.step = 1;

      // Define new Address by input data
      //var newAddress = new Address(name, email, firstName, lastName, companyName, companyTax, phone, zip, city, street);

      // Create a new User with old Users data
      var newUser: User = this.currentUser;

      // Add new Address to Address[]
      //var newAddresses: Address = this.currentUser.address;
      //newAddresses.push(newAddress);

      // Map custom objects into pure Javascript objects
      //const objects = newAddresses.map((obj) => { return Object.assign({}, obj); });
      //newUser.addresses = objects;

      //this.profileService.updateCurrentUser(newUser);
   }

   /**
    * Opens up the Order dialog
    * 
    * @param orderToOpen The Order whose data we need to display
    */
   openDialog(orderToOpen: Order) {
      this.dialog.open(this.dialogRef, { data: orderToOpen, width: '1000px' });
   }

   timestampToDate(timestamp: any): Date {
      return timestamp.toDate();
   }

}
