import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
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

   saveAddress(): void {
      this.step = 1;
   }

   getEmail(): string {
      var email = localStorage.getItem('email');
      if (email != null)
         return email;
      else
         return '';
   }

   getLastName(): string {
      var lastName = localStorage.getItem('lastName');
      if (lastName != null)
         return lastName;
      else
         return '';
   }

   getFirstName(): string {
      var firstName = localStorage.getItem('firstName');
      if (firstName != null)
         return firstName;
      else
         return '';
   }

   getPhone(): string {
      var phone = localStorage.getItem('phone');
      if (phone != null && phone != 'undefined')
         return phone;
      else
         return '';
   }



}
