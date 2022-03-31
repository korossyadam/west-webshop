import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   email = new FormControl('', [Validators.required, Validators.email]);

   public isSignedIn = false;

   constructor(private renderer: Renderer2, public authService: AuthService) {
      this.renderer.setStyle(document.body, 'background-image', 'url(assets/bcg1.jpg)');
   }

   ngOnInit(): void {
      if (localStorage.getItem('user') == null)
         this.isSignedIn = false;
      else
         this.isSignedIn = true;
   }

   ngOnDestroy(): void {
      this.renderer.setStyle(document.body, 'background-image', '');
   }

   async signIn(email: string, password: string) {
      await this.authService.signIn(email, password);

      if (this.authService.isLoggedIn)
         this.isSignedIn = true;
   }

   async signUp(email: string, password: string) {
      await this.authService.signUp(email, password);

      if (this.authService.isLoggedIn)
         this.isSignedIn = true;
   }

   handleLogout() {
      this.isSignedIn = false;
   }

   getErrorMessage() {
      if (this.email.hasError('required')) {
         return 'Kérlek add meg az e-mail címedet!';
      }

      return this.email.hasError('email') ? 'Nem valós e-mail cím.' : '';
   }

}
