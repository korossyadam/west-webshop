import { Component, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   // Form Groups
   public loginForm: FormGroup;
   public signUpForm: FormGroup;

   // Minimum required characters for password on Sign Up
   public passwordMinimum = 6;

   // Error messages
   public loginError = '';
   public signUpError = '';

   public isSignedIn = false;

   constructor(private renderer: Renderer2, public authService: AuthService, private formBuilder: FormBuilder) {
      this.renderer.setStyle(document.body, 'background-image', 'url(assets/bcg1.jpg)');
   }

   ngOnInit(): void {
      if (localStorage.getItem('user') == null)
         this.isSignedIn = false;
      else
         this.isSignedIn = true;

      // Login Form Validators
      this.loginForm = this.formBuilder.group({
         loginEmail: ['', [Validators.required, Validators.email]],
         loginPassword: ['', [Validators.required]],
      });

      // Sign Up Form Validators
      this.signUpForm = this.formBuilder.group({
         signUpEmail: ['', [Validators.required, Validators.email]],
         signUpPassword: ['', [Validators.required, Validators.minLength(this.passwordMinimum)]],
         signUpPasswordAgain: ['', [Validators.required]]
      }, { validator: passwordMatchValidator });
   }

   ngOnDestroy(): void {
      this.renderer.setStyle(document.body, 'background-image', '');
   }

   // Sign in
   async login(email: string, password: string) {

      // Check for errors
      this.loginError = '';
      if(this.loginForm?.get('loginEmail')?.hasError('required')) {
         this.loginError = 'Kérlek add meg az e-mail címedet!';
      }else if(this.loginForm?.get('loginEmail')?.hasError('email')) {
         this.loginError = 'Nem valós e-mail cím!';
      }else if(this.loginForm?.get('loginPassword')?.hasError('required')) {
         this.loginError = 'Kérlek add meg a jelszavad!';
      }

      // If any error is found, Login is cancelled
      if(this.loginError != '')
         return;

      await this.authService.signIn(email, password);

      if (this.authService.isLoggedIn)
         this.isSignedIn = true;
   }


   // Sign up
   async signUp(email: string, password: string) {

      // Check for errors
      this.signUpError = '';
      if(this.signUpForm?.get('signUpEmail')?.hasError('required')) {
         this.signUpError = 'Kérlek add meg az e-mail címedet!';
      }else if(this.signUpForm?.get('signUpEmail')?.hasError('email')) {
         this.signUpError = 'Nem valós e-mail cím!';
      }else if(this.signUpForm?.get('signUpPassword')?.hasError('required')) {
         this.signUpError = 'Kérlek add meg a jelszavad!';
      }else if(this.signUpForm?.get('signUpPassword')?.hasError('minlength')) {
         this.signUpError = 'A jelszónak minimum ' + this.passwordMinimum + ' karakterből kell állnia';
      }else if(this.signUpForm?.get('signUpPasswordAgain')?.invalid) {
         this.signUpError = 'A jelszavak nem egyeznek meg!';
      }

      // If any error is found, Sign Up is cancelled
      if(this.signUpError != '')
         return;

      await this.authService.signUp(email, password);

      if(this.authService.isLoggedIn)
         this.isSignedIn = true;
   }

   // Log out
   handleLogout() {
      this.isSignedIn = false;
   }

   // Every time a character is typed into either password field, matching is checked
   onPasswordInput() {
      if(this.signUpForm.hasError('passwordMismatch'))
         this.signUpForm?.get('signUpPasswordAgain')?.setErrors([{ 'passwordMismatch': true }]);
      else
         this.signUpForm?.get('signUpPasswordAgain')?.setErrors(null);
   }

}


// Custom Validator for signup
export const passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
   if(formGroup.get('signUpPassword')?.value === formGroup.get('signUpPasswordAgain')?.value)
      return null;
   else
      return { passwordMismatch: true };
};
