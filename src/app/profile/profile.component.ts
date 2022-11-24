import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first, Timestamp } from 'rxjs';
import { Address } from '../models/address.model';
import { Order } from '../models/order.model';
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

   @ViewChild('dialogRef') dialogRef!: TemplateRef<any>;

   public currentUser: User;

   public step: number = 0;

   public orders: Order[];

   constructor(private utilsService: UtilsService, private profileService: ProfileService, private dialog: MatDialog) { }

   ngOnInit(): void {
      this.profileService.getCurrentUser().pipe(first()).subscribe(data => this.currentUser = data[0]);

      this.profileService.getCurrentUserOrders().subscribe(data => {
         this.orders = data;
      });
   }

   // Add a new Address to current User
   saveAddress(name: string, email: string, lastName: string, firstName: string, companyName: string, companyTax: string, phone: string, zip: string, city: string, street: string): void {
      this.step = 1;

      // Define new Address by input data
      var newAddress = new Address(name, email, firstName, lastName, companyName, companyTax, phone, zip, city, street);

      // Create a new User with old Users data
      var newUser: User = this.currentUser;

      // Add new Address to Address[]
      var newAddresses: Address[] = this.currentUser.addresses;
      newAddresses.push(newAddress);

      // Map custom objects into pure Javascript objects
      const objects = newAddresses.map((obj) => { return Object.assign({}, obj); });
      newUser.addresses = objects;

      this.profileService.updateCurrentUser(newUser);
   }

   openDialog(orderToOpen: Order) {
      this.dialog.open(this.dialogRef, { data: orderToOpen, width: '1000px' });
   }

   timestampToDate(timestamp: any): Date {
      return timestamp.toDate();
   }

}
