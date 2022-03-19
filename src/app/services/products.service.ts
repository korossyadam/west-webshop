import { Injectable, Input } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  @Input() searchBarText = "";

  constructor(private afs: AngularFirestore, private db: AngularFireDatabase) {}

  // Search for products
  search(collectionName: string, searchedText: string): Observable<Product[]> {
    return this.afs.collection(collectionName, ref  => {
      let query: CollectionReference | Query = ref;
      query = query.where('partNumber', '==', searchedText);
      //query = query.orderBy('name', 'asc');
      return query;
    }).valueChanges() as Observable<Product[]>;
  }

}
