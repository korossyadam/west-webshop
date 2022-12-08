import { Injectable, Input } from '@angular/core';

import { arrayUnion } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // Static functions
  getUserId = this.utilsService.getUserId;

  @Input() searchBarText = "";

  constructor(private utilsService: UtilsService, private afs: AngularFirestore, private db: AngularFireDatabase) { }

  // Search for Products
  search(searchedText: string): Observable<Product[]> {

    let strlength = searchedText.length;
    let strFrontCode = searchedText.slice(0, strlength - 1);
    let strEndCode = searchedText.slice(strlength - 1, searchedText.length);

    let startcode = searchedText;
    let endcode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

    return this.afs.collection('products', ref => {
      let query: CollectionReference | Query = ref;
      query = query.where('partNumber', '>=', startcode.trim().toUpperCase()).where('partNumber', '<', endcode.trim().toUpperCase()).limit(5);
      return query;
    }).valueChanges() as Observable<Product[]>;
  }

  getProductsBySpecialCategory(specialCategory: number): Observable<Product[]> {
    return this.afs.collection('products', ref => {
      let query: CollectionReference | Query = ref;
      query = query.where('specialCategory', '==', specialCategory).orderBy('name').limit(10);
      return query;
    }).valueChanges() as Observable<Product[]>;
  }

  getProductsByArray(partNumbers: string[]): Observable<Product[]> {
    return this.afs.collection('products', ref => {
      let query: CollectionReference | Query = ref;
      query = query.where('partNumber', 'in', partNumbers).orderBy('name').limit(10);
      return query;
    }).valueChanges() as Observable<Product[]>;
  }

  // Get exactly one Product
  getProduct(searchedText: string): Observable<Product[]> {
    return this.afs.collection('products', ref => {
      let query: CollectionReference | Query = ref;
      query = query.where('partNumber', '==', searchedText).limit(1);
      return query;
    }).valueChanges() as Observable<Product[]>;
  }

  addToWishList(product: Product): Promise<void> {
    return this.afs.doc('users/' + this.getUserId()).update({
      wishList: arrayUnion(Object.assign({}, product))
    });
  }

}
