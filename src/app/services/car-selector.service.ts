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
   
   // Get Cars by Chassis
   selectChassis(searchedText: string): Observable<Car[]> {
      return this.afs.collection("cars", ref => ref.where("chassis", "==", searchedText).orderBy("engine", "asc")).valueChanges() as Observable<Car[]>;
   }

}
