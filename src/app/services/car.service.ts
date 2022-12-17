import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { arrayUnion } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';
import { Product } from '../models/product.model';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  
   // Static functions
   getUserId = this.utilsService.getUserId;

  constructor(private utilsService: UtilsService, private afs: AngularFirestore, private db: AngularFireDatabase) { }

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
    return this.afs.collection("products", ref => ref.where("carIndexes", "array-contains", carIndex.toString()).where('secondCategory', '==', partCategory).orderBy('price', 'asc').limit(100)).valueChanges() as Observable<Product[]>;
  }

  addToGarage(carIndex: number): Promise<void> {
    return this.afs.doc('users/' + this.getUserId()).update({
      garage: arrayUnion(carIndex)
    });
  }

}
