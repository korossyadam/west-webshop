import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Product } from '../models/product.model';
import { Observable, firstValueFrom, map } from 'rxjs';
import { Offer } from '../models/offer.model';
import { Order } from '../models/order.model';
import { Car } from '../models/car.model';
import { Chassis } from '../models/chassis.model';
import { deleteField } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private afs: AngularFirestore, private db: AngularFireDatabase, private afbs: AngularFireStorage) { }

  // Attempt login (for guard)
  getAdminId(id: string) {
    return this.afs.collection('safeConfig', ref => {
      let query: CollectionReference | Query = ref;
      query = query.where('adminId', '==', id).limit(10);
      return query;
    }).valueChanges();
  }

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

  /**
   * Deletes an image from storage.
   *
   * @param {string} imageUrl The URL of the image to delete.
   */
  async deleteImage(imageUrl: string) {
    this.afbs.refFromURL(imageUrl).delete();
  }

  getNextUncategorizedProduct(): Observable<Product[]>{
    return this.afs.collection('products', ref => {
        let query: CollectionReference | Query = ref;
        query = query.where('specialCategories', 'array-contains', -2).orderBy('partNumber').limit(1);
        return query;
      }).valueChanges() as Observable<Product[]>
  }

  // Upload Data
  async uploadData(collectionName: string, data: any): Promise<string> {
    const uid = this.afs.createId();
    await this.afs.collection(collectionName).doc(uid).set(data);
    return uid;
  }

  // Get Offers
  getOffers(from: Date, to: Date, unAnsweredOnly: boolean): Observable<Offer[]> {
    return this.afs.collection('offers', ref => {
      let query: CollectionReference | Query = ref;
      if (unAnsweredOnly) {
        query = query.orderBy('date').startAt(from).endAt(to).where('answered', '==', false).limit(20);
      } else {
        query = query.orderBy('date').startAt(from).endAt(to).limit(20);
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

  // Get a single product
  getSingleProduct(partNumber: string): Observable<Product[]> {
    return this.afs.collection('products', ref => {
      let query: CollectionReference | Query = ref;
      query = query.where('partNumber', '==', partNumber).limit(1);
      return query;
    }).snapshotChanges().pipe(
      map(offers => {
        return offers.map(o => {
          const data = o.payload.doc.data() as Product;
          const id = o.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  updateProduct(product: Product, uid: string): Promise<void> {
    return this.afs.collection('products').doc(uid).update(product);
  }

  deleteProduct(uid: string): Promise<void> {
    return this.afs.collection('products').doc(uid).delete();
  }

  // Get Orders
  getOrders(from: Date, to: Date): Observable<Order[]> {
    return this.afs.collection('orders', ref => {
      let query: CollectionReference | Query = ref;
      query = query.orderBy('date').startAt(from).endAt(to).limit(20);
      return query;
    }).valueChanges() as Observable<Order[]>;
  }

 modifyQuantity(line: string) {
    let parts: string[] = line.split(';');
    let index = parts[0];

    let fields: string[] = [];
    for (let i = 1; i < parts.length; i++) {
       fields.push(parts[i].split(' ')[0] + '*' + parts[i].split(' ')[1]);
    }
    //console.log(fields);
    //console.log(index);
    this.afs.collection("cars", ref => ref.where('carIndex', '==', parseInt(index))).get().subscribe(data => {
       let id = data.docs[0].id;
       this.afs.collection('cars').doc(id).update({
          productLengths: fields,
          productLenghts: deleteField(),
       }).then(res => console.log(id + ' finished'));
    });
 }
}
