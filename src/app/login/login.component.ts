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

   // Login Flag
   public isSignedIn = false;

   constructor(private renderer: Renderer2, public authService: AuthService, private formBuilder: FormBuilder) {
      this.renderer.setStyle(document.body, 'background-image', 'url(assets/bcg1.jpg)');
   }

   ngOnInit(): void {
      if(localStorage.getItem('user') == null)
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
         lastName: ['', [Validators.required]],
         firstName: ['', [Validators.required]],
         signUpPassword: ['', [Validators.required, Validators.minLength(this.passwordMinimum)]],
         signUpPasswordAgain: ['', [Validators.required]]
      }, { validator: passwordMatchValidator });
   }

   ngOnDestroy(): void {
      this.renderer.setStyle(document.body, 'background-image', '');
   }

   // Login
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
      
      // Check for any errors thrown by firebase-auth
      await this.authService.signIn(email, password).catch(err => {
         console.log("Login error: " + err.code);

         if(err.code == 'auth/user-not-found'){
            this.loginError = 'A megadott felhasználó nem létezik!';
         }else if(err.code == 'auth/wrong-password'){
            this.loginError = 'Nem megfelelő jelszó!';
         }else {
            this.loginError = 'Hiba!: ' + err.code;
         }
      });
      
      // Set Login flag to true
      if(this.authService.isLoggedIn)
         this.isSignedIn = true;
   }
   
   // Sign up
   async signUp(email: string, password: string, lastName: string, firstName: string) {

      // Check for errors
      this.signUpError = '';
      if(this.signUpForm?.get('signUpEmail')?.hasError('required')) {
         this.signUpError = 'Kérlek add meg az e-mail címedet!';
      }else if(this.signUpForm?.get('signUpEmail')?.hasError('email')) {
         this.signUpError = 'Nem valós e-mail cím!';
      }else if((this.signUpForm?.get('lastName')?.hasError('required')) || (this.signUpForm?.get('firstName')?.hasError('required'))) {
         this.signUpError = 'Kérlek add meg a neved!';
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

      // Check for any errors thrown by firebase-auth
      await this.authService.signUp(email, password).catch(err => {
         console.log("Sign Up error: " + err.code);

         if(err.code == 'auth/email-already-in-use'){
            this.signUpError = 'Ez az e-mail cím már használatban van!';
         }else {
            this.signUpError = 'Hiba!: ' + err.code;
         }
      });

      // Set Login flag to true
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
