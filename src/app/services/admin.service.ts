import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Product } from '../models/product.model';
import { Observable, first, firstValueFrom } from 'rxjs';

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
}
