import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { arrayRemove } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Address } from '../models/address.model';
import { Offer } from '../models/offer.model';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';

@Injectable({
   providedIn: 'root'
})
export class ProfileService {

   // Static functions
   getUserId = this.utilsService.getUserId;

   constructor(private utilsService: UtilsService, private afs: AngularFirestore, private db: AngularFireDatabase) { }

   // Get current User
   getCurrentUser(): Observable<User[]> {
      return this.afs.collection('users', ref => {
         let query: CollectionReference | Query = ref;
         query = query.where('email', '==', localStorage.getItem('email'));
         //query = query.orderBy('name', 'asc');
         return query;
      }).valueChanges() as Observable<User[]>;
   }

   // Update current User basic data
   updateCurrentUser(name: string, phoneNumber: string): Promise<void> {
      return this.afs.doc('users/' + this.getUserId()).update({
         name: name,
         phoneNumber: phoneNumber,
      });
   }

   // Update current User address
   updateCurrentUserAddress(newAddress: Address): Promise<void> {
      return this.afs.doc('users/' + this.getUserId()).update({
         address: newAddress
      });
   }

   // Get Orders
   getCurrentUserOrders(): Observable<Order[]> {
      return this.afs.collection('orders', ref => {
         let query: CollectionReference | Query = ref;
         query = query.where('userId', '==', this.getUserId());
         return query;
      }).valueChanges() as Observable<Order[]>;
   }

   // Get Offers
   getCurrentUserOffers(): Observable<Offer[]> {
      return this.afs.collection('offers', ref => {
         let query: CollectionReference | Query = ref;
         query = query.where('userId', '==', this.getUserId());
         return query;
      }).valueChanges() as Observable<Offer[]>;
   }

   removeFromWishList(product: Product): Promise<void> {
      return this.afs.doc('users/' + this.getUserId()).update({
        wishList: arrayRemove(Object.assign({}, product))
      });
    }
}
