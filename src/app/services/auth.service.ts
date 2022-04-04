import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { first, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
   providedIn: 'root'
})
export class AuthService {

   public static isLoggedIn: boolean;

   constructor(public firebaseAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) { }

   // FireBase Login
   async signIn(email: string, password: string) {
      await this.firebaseAuth.signInWithEmailAndPassword(email, password)
         .then(res => {
            AuthService.isLoggedIn = true;
            localStorage.setItem('user', JSON.stringify(res.user));
            localStorage.setItem('email', email);
            this.router.navigate(['main']);

            var user: User;
            var promise = this.afs.collection("users", ref => ref.where("email", "==", email).orderBy("lastName", "asc")).valueChanges() as Observable<User[]>
            promise.pipe(first()).subscribe(data => {
               user = data[0];
               localStorage.setItem('firstName', user.firstName);
               localStorage.setItem('lastName', user.lastName);
               localStorage.setItem('phone', user.phone);
            })

         })
   }

   // FireBase SignUp
   async signUp(email: string, password: string, lastName: string, firstName: string) {

      // Create user
      await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
         .then(res => {
            AuthService.isLoggedIn = true;
            localStorage.setItem('user', JSON.stringify(res.user));
            localStorage.setItem('email', email);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('firstName', firstName);
            this.router.navigate(['main']);

            // Attach first name and last name in a seperate collection
            var user: User = new User(email, firstName, lastName, '');
            this.afs.collection('users').doc(email).set(Object.assign({}, user));

         })

   }

   // FireBase Logout
   logout() {
      AuthService.isLoggedIn = false;
      localStorage.removeItem('user');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
   }

}
