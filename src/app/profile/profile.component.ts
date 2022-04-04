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

}
