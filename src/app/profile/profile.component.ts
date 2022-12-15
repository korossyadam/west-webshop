import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { first, Timestamp } from 'rxjs';
import { Address } from '../models/address.model';
import { Car } from '../models/car.model';
import { Offer } from '../models/offer.model';
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

   // References to openable dialogues
   @ViewChild('orderDialogRef') orderDialogRef!: TemplateRef<any>;
   @ViewChild('offerOriginalDialogRef') offerOriginalDialogRef!: TemplateRef<any>;
   @ViewChild('offerAnsweredDialogRef') offerAnsweredDialogRef!: TemplateRef<any>;

   public currentUser: User;
   public orders: Order[];
   public offers: Offer[];
   public cars: Car[] = [];

   // This variable keeps track of which window we currently have open
   public step: number = 0;

   constructor(private utilsService: UtilsService, private route: ActivatedRoute, private profileService: ProfileService, private dialog: MatDialog) { }

   ngOnInit(): void {
      this.route.params.subscribe(params => {
         this.step = parseInt(params['tab']);
      });

      this.profileService.getCurrentUser().subscribe(data => {
         this.currentUser = data as User;

         // Query for Cars
         for (let i = 0; i < this.currentUser.garage.length; i++) {
            this.profileService.getCar(this.currentUser.garage[i]).pipe(first()).subscribe(data => {
               this.cars.push(data[0]);
            });
         }
      });

      // Query for Orders
      this.profileService.getCurrentUserOrders().subscribe(data => {
         this.orders = data;
      });

      // Query for Offers
      this.profileService.getCurrentUserOffers().subscribe(data => {
         this.offers = data;
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
      });
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
         window.location.reload();

         this.showSnackBar('Termék sikeresen eltávolítva!', 'Bezárás', 4000);
      });
   }

   /**
    * Removes a Car from the current user's garage
    * Removes it from the database and if successful, removes it from the local variable
    * 
    * @param productToRemove The Car to remove
    */
    removeGarageCar(carToRemove: Car): void {
      this.profileService.removeFromGarage(parseInt(carToRemove.carIndex)).then(res => {

         // Remove the product from wishlist locally
         const index = this.cars.indexOf(carToRemove, 0);
         if (index > -1) {
            this.cars.splice(index, 1);
         }

         this.showSnackBar('Autó sikeresen eltávolítva!', 'Bezárás', 4000);
      });
   }

   /**
    * Opens up the Order dialog
    * 
    * @param orderToOpen The Order whose data we need to display
    */
   openOrderDialog(orderToOpen: Order) {
      this.dialog.open(this.orderDialogRef, { data: orderToOpen, width: '1000px' });
   }

   /**
    * Opens up the Offer dialog, with original question
    * 
    * @param offerToOpen The Offer whose data we need to display
    */
   openOriginalOfferDialog(offerToOpen: Offer) {
      this.dialog.open(this.offerOriginalDialogRef, { data: offerToOpen, width: '1000px' });
   }

   /**
    * Opens up the Offer dialog, with answer
    * 
    * @param offerToOpen The Offer whose data we need to display
    */
   openAnsweredOfferDialog(offerToOpen: Offer) {
      this.dialog.open(this.offerAnsweredDialogRef, { data: offerToOpen, width: '1000px' });
   }

   /**
    * Converts a Firebase Timestamp object to a more readable Date object
    * 
    * @param timestamp The Timestamp to convert
    * @returns The Date object
    */
   timestampToDate(timestamp: any): Date {
      return timestamp.toDate();
   }

}
