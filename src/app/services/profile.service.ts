import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
   providedIn: 'root'
})
export class ProfileService {

   constructor(private afs: AngularFirestore, private db: AngularFireDatabase) { }

   // Get current User
   getCurrentUser(): Observable<User[]> {
      return this.afs.collection('users', ref => {
         let query: CollectionReference | Query = ref;
         query = query.where('email', '==', localStorage.getItem('email'));
         //query = query.orderBy('name', 'asc');
         return query;
      }).valueChanges() as Observable<User[]>;
   }

   // Update current User
   updateCurrentUser(newUser: User): void {
      this.afs.doc('users/' + localStorage.getItem('email')).update(newUser);
   }
}
