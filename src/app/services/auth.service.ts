import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
   providedIn: 'root'
})
export class AuthService {

   public static isLoggedIn: boolean;

   constructor(public firebaseAuth: AngularFireAuth, private router: Router) { }

   // FireBase Login
   async signIn(email: string, password: string) {
      await this.firebaseAuth.signInWithEmailAndPassword(email, password)
         .then(res => {
            AuthService.isLoggedIn = true;
            localStorage.setItem('user', JSON.stringify(res.user));
            this.router.navigate(['main']);
         })
   }

   // FireBase SignUp
   async signUp(email: string, password: string, lastName: string, firstName: string) {
      await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
         .then(res => {
            AuthService.isLoggedIn = true;
            localStorage.setItem('user', JSON.stringify(res.user));
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('firstName', firstName);
            this.router.navigate(['main']);
         })
   }

   // FireBase Logout
   logout() {
      AuthService.isLoggedIn = false;
      localStorage.removeItem('user');
   }

}
