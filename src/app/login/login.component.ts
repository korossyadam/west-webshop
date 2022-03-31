import { Component, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   public formGroup: FormGroup;
   public email = new FormControl('', [Validators.required, Validators.email]);
   public passwordMinimum = 8;

   public isSignedIn = false;

   constructor(private renderer: Renderer2, public authService: AuthService, private formBuilder: FormBuilder) {
      this.renderer.setStyle(document.body, 'background-image', 'url(assets/bcg1.jpg)');
   }

   ngOnInit(): void {
      if (localStorage.getItem('user') == null)
         this.isSignedIn = false;
      else
         this.isSignedIn = true;

      this.formGroup = this.formBuilder.group({
         password: ['', [Validators.required, Validators.minLength(this.passwordMinimum)]],
         password2: ['', [Validators.required]]
      }, { validator: passwordMatchValidator });
   }

   ngOnDestroy(): void {
      this.renderer.setStyle(document.body, 'background-image', '');
   }

   // Sign in
   async signIn(email: string, password: string) {
      await this.authService.signIn(email, password);

      if (this.authService.isLoggedIn)
         this.isSignedIn = true;
   }


   // Sign up
   async signUp(email: string, password: string) {
      await this.authService.signUp(email, password);

      if (this.authService.isLoggedIn)
         this.isSignedIn = true;
   }

   // Log out
   handleLogout() {
      this.isSignedIn = false;
   }

   // E-mail error message
   getErrorMessage() {
      if (this.email.hasError('required')) {
         return 'Kérlek add meg az e-mail címedet!';
      }

      return this.email.hasError('email') ? 'Nem valós e-mail cím.' : '';
   }


   get password() { return this.formGroup?.get('password'); }
   get password2() { return this.formGroup?.get('password2'); }

   // Every time a character is typed into either password field, matching is checked
   onPasswordInput() {
      if (this.formGroup.hasError('passwordMismatch'))
         this.password2?.setErrors([{ 'passwordMismatch': true }]);
      else
         this.password2?.setErrors(null);
   }



}


export const passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
   if (formGroup.get('password')?.value === formGroup.get('password2')?.value)
      return null;
   else
      return { passwordMismatch: true };
};
