import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UtilsService } from '../services/utils.service';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   // Static functions
   showSnackBar = this.utilsService.openSnackBar;

   // Form Groups
   public loginForm: FormGroup;
   public signUpForm: FormGroup;

   // Minimum required characters for password on Sign Up
   public passwordMinimum = 6;

   // Error messages
   public loginError = '';
   public signUpError = '';

   // Loading flags
   public loginLoading: boolean = false;
   public signUpLoading: boolean = false;

   constructor(private utilsService: UtilsService, private authService: AuthService, private formBuilder: FormBuilder) { }

   ngOnInit(): void {
      // Login Form Validators
      this.loginForm = this.formBuilder.group({
         loginEmail: ['', [Validators.required, Validators.email]],
         loginPassword: ['', [Validators.required]],
      });

      // Sign Up Form Validators
      this.signUpForm = this.formBuilder.group({
         signUpEmail: ['', [Validators.required, Validators.email]],
         lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[^0-9]+$')]],
         firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[^0-9]+$')]],
         signUpPassword: ['', [Validators.required, Validators.minLength(this.passwordMinimum)]],
         signUpPasswordAgain: ['', [Validators.required]]
      }, { validator: passwordMatchValidator });
   }

   /**
    * Logs in User
    * On successful validation calls AuthService
    * 
    * @param email Email address of the User
    * @param password Password of the User
    */
   async login(email: string, password: string, rememberMe: boolean) {

      // Check for errors
      this.loginError = '';
      if (this.loginForm?.get('loginEmail')?.hasError('required')) {
         this.loginError = 'Az e-mail cím nem lehet üres.';
      } else if (this.loginForm?.get('loginEmail')?.hasError('email')) {
         this.loginError = 'Az e-mail cím formátuma nem megfelelő';
      } else if (this.loginForm?.get('loginPassword')?.hasError('required')) {
         this.loginError = 'A jelszó nem lehet üres.';
      }

      // If any error is found, Login is cancelled
      if (this.loginError != '') {
         return;
      }

      // Set loading flag to true
      this.loginLoading = true;

      // Check for any errors thrown by firebase-auth
      await this.authService.signIn(email, password, rememberMe).then(async result => {
         await new Promise(f => setTimeout(f, 400));
         this.showSnackBar('Sikeres bejelentkezés!', 'Bezárás', 4000);
      }).catch(async err => {
         if (err.code == 'auth/user-not-found') {
            this.loginError = 'Ez a felhasználó nem létezik';
         } else if (err.code == 'auth/wrong-password') {
            this.loginError = 'A jelszó nem megfelelő.';
         } else {
            this.loginError = 'Hiba: ' + err.code;
         }

         await new Promise(f => setTimeout(f, 400));
         this.loginLoading = false;
      });
   }

   /**
    * Signs up a new User
    * On successful validation calls AuthService
    * 
    * @param email Email address of the new User
    * @param password Password of the new User
    * @param lastName Last name of the new User
    * @param firstName First name of the new User
    */
   async signUp(email: string, password: string, lastName: string, firstName: string): Promise<void> {

      // Check for errors
      this.signUpError = '';
      if (this.signUpForm?.get('signUpEmail')?.hasError('required')) {
         this.signUpError = 'Az e-mail cím nem lehet üres.';
      } else if (this.signUpForm?.get('signUpEmail')?.hasError('email')) {
         this.signUpError = 'Az e-mail cím formátuma nem megfelelő';
      } else if ((this.signUpForm?.get('lastName')?.hasError('required')) || (this.signUpForm?.get('firstName')?.hasError('required'))) {
         this.signUpError = 'A név nem lehet üres.';
      } else if (this.signUpForm?.get('lastName')?.hasError('minLength') || (this.signUpForm?.get('firstName')?.hasError('minLength'))) {
         this.signUpError = 'A név túl rövid.';
      } else if (this.signUpForm?.get('lastName')?.hasError('pattern') || (this.signUpForm?.get('firstName')?.hasError('pattern'))) {
         this.signUpError = 'A név csak betűket tartalmazhat.';
      } else if (this.signUpForm?.get('signUpPassword')?.hasError('required')) {
         this.signUpError = 'A jelszó nem lehet üres';
      } else if (this.signUpForm?.get('signUpPassword')?.hasError('minlength')) {
         this.signUpError = 'A jelszónak minimum ' + this.passwordMinimum + ' karakterből kell állnia.';
      } else if (this.signUpForm?.get('signUpPasswordAgain')?.invalid) {
         this.signUpError = 'A jelszavak nem egyeznek meg.';
      }

      // If any error is found, Sign Up is cancelled
      if (this.signUpError != '') {
         return;
      }

      // Set loading flag to true
      this.signUpLoading = true;

      // Combine last name and first name
      let name = lastName + ' ' + firstName;

      // Check for any errors thrown by firebase-auth
      await this.authService.signUp(email, password, name).then(async result => {
         await new Promise(f => setTimeout(f, 400));
         this.showSnackBar('Sikeres regisztráció!', 'Bezárás', 4000);
      }).catch(async err => {
         if (err.code == 'auth/email-already-in-use') {
            this.signUpError = 'Ez az e-mail cím már használatban van.';
         } else {
            this.signUpError = 'Hiba: ' + err.code;
         }

         await new Promise(f => setTimeout(f, 400));
         this.signUpLoading = false;
      });
   }

   /**
    * Every time a character is typed into either password field, matching is checked
    */
   onPasswordInput(): void {
      if (this.signUpForm.hasError('passwordMismatch'))
         this.signUpForm?.get('signUpPasswordAgain')?.setErrors([{ 'passwordMismatch': true }]);
      else
         this.signUpForm?.get('signUpPasswordAgain')?.setErrors(null);
   }

}

/**
 * Custom validator for signup
 * Checks if the 2 passwords match
 * 
 * @param formGroup 
 * @returns 
 */
export const passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
   if (formGroup.get('signUpPassword')?.value === formGroup.get('signUpPasswordAgain')?.value)
      return null;
   else
      return { passwordMismatch: true };
};
