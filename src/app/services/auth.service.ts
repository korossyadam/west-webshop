import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { first, Observable } from 'rxjs';
import { User } from '../models/user.model';
import firebase from 'firebase/compat/app';

@Injectable({
   providedIn: 'root',
})
export class AuthService {

   constructor(public firebaseAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {}

   /**
    * Logs the User in using AngularFireAuth
    * After successful login, queries for stored user data, such as phone number and name
    * The additional data is always saved in sessionStorage
    * If 'Remember Me' checkbox is checked, the data is also saved in localStorage
    * 
    * @param email The email that the user entered
    * @param password The password that the user entered
    * @param rememberMe Whether the 'Remember Me' checkbox is checked
    */
   async signIn(email: string, password: string, rememberMe: boolean) {

      // Set persistance based on 'remember me' button value
      let persistence = firebase.auth.Auth.Persistence.LOCAL;
      if (!rememberMe) {
         persistence = firebase.auth.Auth.Persistence.SESSION;
      }

      await this.firebaseAuth.setPersistence(persistence).then(async () => {
         await this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res => {

            // Query for User Token
            res.user?.getIdToken().then(userResponse => {
               sessionStorage.setItem('user_token', userResponse);
               if (rememberMe) {
                  localStorage.setItem('user_token', userResponse);
               }
            });

            // Set email and user data in browser storage
            sessionStorage.setItem('user', JSON.stringify(res.user));
            sessionStorage.setItem('email', email);
            if (rememberMe) {
               localStorage.setItem('user', JSON.stringify(res.user));
               localStorage.setItem('email', email);
            }

            // Query for additional data, such as phone number and name
            var promise = this.afs.collection('users', ref => ref.where('email', '==', email).orderBy('name', 'asc')).valueChanges() as Observable<User[]>;
            promise.pipe(first()).subscribe(data => {
               let user = data[0];
               sessionStorage.setItem('name', user.name);
               sessionStorage.setItem('phone', user.phoneNumber);
               if (rememberMe) {
                  localStorage.setItem('name', user.name);
                  localStorage.setItem('phone', user.phoneNumber);
               }
               
               // After finishing with login, reroute to main
               this.router.navigate(['main']);
            });

         });
      });

   }

   /**
    * Signs the User up using AngularFireAuth
    * Default signup acts as 'Remember Me'checkbox would be checked
    * Therefore personal data is saved to the localStorage also
    * 
    * @param email The email that the user entered
    * @param password The password that the user entered
    * @param name The name that the user entered
    */
   async signUp(email: string, password: string, name: string) {
      await this.firebaseAuth.createUserWithEmailAndPassword(email, password).then(res => {
         res.user?.getIdToken().then(userResponse => {
            localStorage.setItem('user_token', userResponse);

            // Attach additional data in a seperate collection
            var user: User = new User(email, name);
            var userId = JSON.parse(atob(userResponse.split('.')[1]))['user_id'];
            this.afs.collection('users').doc(userId).set(Object.assign({}, user));
         });

         sessionStorage.setItem('user', JSON.stringify(res.user));
         localStorage.setItem('user', JSON.stringify(res.user));
         sessionStorage.setItem('email', email);
         localStorage.setItem('email', email);
         sessionStorage.setItem('name', name);
         localStorage.setItem('name', name);
         sessionStorage.setItem('phone', '');
         localStorage.setItem('phone', '');

         // After finishing with signup, reroute to main
         this.router.navigate(['main']);
      });
   }

   /**
    * Signs out the current user
    * Removes all personal data that was stored in the browser's storage
    */
   logout() {
      this.firebaseAuth.signOut();

      localStorage.removeItem('user');
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('phone');
      localStorage.removeItem('user_token');
      sessionStorage.clear();
   }

}
