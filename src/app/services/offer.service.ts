import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { Offer } from '../models/offer.model';

@Injectable({
   providedIn: 'root'
})
export class OfferService {

   constructor(private afs: AngularFirestore, private db: AngularFireDatabase) { }

   async createNewOffer(offer: Offer): Promise<void> {
      const uid = this.afs.createId();
      return this.afs.collection('offers').doc(uid).set(offer);
   }

}
