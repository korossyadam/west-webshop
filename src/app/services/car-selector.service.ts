import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Chassis } from '../models/chassis.model';
import { Car } from '../models/car.model';
import { deleteField, FieldValue } from 'firebase/firestore';
import { Product } from '../models/product.model';

@Injectable({
   providedIn: 'root'
})
export class CarSelectorService {

   constructor(private afs: AngularFirestore, private db: AngularFireDatabase) { }

   // Get Chassis by Brand
   selectBrand(searchedText: string): Observable<Chassis[]> {
      return this.afs.collection("chassis", ref => ref.where("brand", "==", searchedText).orderBy("name", "asc")).valueChanges() as Observable<Chassis[]>;
   }

   // Get Chassis by Brand
   getAllChassis(): Observable<Chassis[]> {
      return this.afs.collection("chassis", ref => ref.orderBy("name", "asc")).valueChanges() as Observable<Chassis[]>;
   }

   // Get Cars by Chassis
   selectChassis(searchedText: string): Observable<Car[]> {
      return this.afs.collection("cars", ref => ref.where("chassis", "==", searchedText).orderBy("engine", "asc")).valueChanges() as Observable<Car[]>;
   }

   // Upload Data
   async addChassis(collectionName: string, data: Chassis, id?: string): Promise<string> {
      const uid = id ? id : this.afs.createId();
      // data.id = uid;
      await this.afs.collection(collectionName).doc(uid).set(data);
      return uid;
   }

   // Upload Data
   async addCars(collectionName: string, data: Car, id?: string): Promise<string> {
      const uid = id ? id : this.afs.createId();
      // data.id = uid;
      await this.afs.collection(collectionName).doc(uid).set(data);
      return uid;
   }

   // Upload Data
   async addProduct(data: Product): Promise<void> {
      const uid = this.afs.createId();
      return this.afs.collection('products').doc(uid).set(data);
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
