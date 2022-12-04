import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Product } from '../models/product.model';
import { Observable, first, firstValueFrom, map } from 'rxjs';
import { Offer } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private afs: AngularFirestore, private db: AngularFireDatabase, private afbs: AngularFireStorage) { }

  // Upload an image
  async uploadImage(imagePath: string) {
    var ref = 'products/' + Math.random() + imagePath;
    let returnValue = '-1';

    // Attempt to upload image to firestore
    await this.afbs.upload(ref, imagePath).then(async finished => {
      if (finished.state == 'success') {
        let observable = this.afbs.ref(ref).getDownloadURL();
        let promise = firstValueFrom(observable);
        await promise.then(async data => {
          returnValue = data;
        });
      }

    });

    return returnValue;
  }

  // Upload Data
  async addProduct(product: Product): Promise<string> {
    const uid = this.afs.createId();
    await this.afs.collection('products').doc(uid).set(product);
    return uid;
  }

  // Get Offers
  getOffers(from: Date, to: Date, unAnsweredOnly: boolean): Observable<Offer[]> {
    return this.afs.collection('offers', ref => {
      let query: CollectionReference | Query = ref;
      if (unAnsweredOnly) {
        query = query.orderBy('date').startAt(from).endAt(to).where('answered', '==', false).limit(100);
      } else {
        query = query.orderBy('date').startAt(from).endAt(to).limit(100);
      }
      return query;
    }).snapshotChanges().pipe(
      map(offers => {
        return offers.map(o => {
          const data = o.payload.doc.data() as Offer;
          const id = o.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  /**
   * Updates an offer
   * 
   * @param offer The Offer with its new variables
   * @returns Promise
   */
  updateOffer(offer: Offer): Promise<void> {
    return this.afs.doc('offers/' + offer['id']).update(offer);
  }
}
