import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private afs: AngularFirestore, private db: AngularFireDatabase) { }

  // Get current Car
  getCurrentCar(carIndex: number): Observable<Car[]> {
    return this.afs.collection('cars', ref => {
      let query: CollectionReference | Query = ref;
      query = query.where('carIndex', '==', carIndex).limit(1);
      return query;
    }).valueChanges() as Observable<Car[]>;
  }

  // Get Products
  getProducts(carIndex: string, partCategory: string): Observable<Product[]> {
    return this.afs.collection("products", ref => ref.where("carIndexes", "array-contains", carIndex.toString()).where('secondCategory', '==', partCategory).orderBy('price', 'asc').limit(10)).valueChanges() as Observable<Product[]>;
  }

}
