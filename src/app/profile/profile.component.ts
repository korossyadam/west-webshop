import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
   selector: 'app-profile',
   templateUrl: './profile.component.html',
   styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

   public step: number = 0;

   constructor() { }

   ngOnInit(): void {
   }

   getEmail(): string {
      var email = localStorage.getItem('email');
      if(email != null)
         return email;
      else
         return '';
   }

   getLastName(): string {
      var lastName = localStorage.getItem('lastName');
      if(lastName != null)
         return lastName;
      else
         return '';
   }

   getFirstName(): string {
      var firstName = localStorage.getItem('firstName');
      if(firstName != null)
         return firstName;
      else
         return '';
   }

   getPhone(): string {
      var phone = localStorage.getItem('phone');
      if(phone != null && phone != 'undefined')
         return phone;
      else
         return '';
   }



}
