import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { Address } from '../models/address.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

@Component({
   selector: 'app-profile',
   templateUrl: './profile.component.html',
   styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

   public currentUser: User;

   public step: number = 0;

   constructor(public profileService: ProfileService) { }

   ngOnInit(): void {
      this.profileService.getCurrentUser().pipe(first()).subscribe(data => this.currentUser = data[0]);
   }

   addNewAddress(): void {
      this.step = 11;
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
      const objects = newAddresses.map((obj)=> {return Object.assign({}, obj)});
      newUser.addresses = objects;

      this.profileService.updateCurrentUser(newUser);
   }

   // Return Email from localStorage
   getEmail(): string {
      var email = localStorage.getItem('email');
      if (email != null)
         return email;
      else
         return '';
   }

   // Return LastName from localStorage
   getLastName(): string {
      var lastName = localStorage.getItem('lastName');
      if (lastName != null)
         return lastName;
      else
         return '';
   }

   // Return FirstName from localStorage
   getFirstName(): string {
      var firstName = localStorage.getItem('firstName');
      if (firstName != null)
         return firstName;
      else
         return '';
   }

   // Return Phone from localStorage
   getPhone(): string {
      var phone = localStorage.getItem('phone');
      if (phone != null && phone != 'undefined')
         return phone;
      else
         return '';
   }



}
