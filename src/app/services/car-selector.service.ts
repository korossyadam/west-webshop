import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Chassis } from '../models/chassis.model';
import { collection, query, where, getDocs } from "firebase/firestore";
import { Car } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarSelectorService {

  constructor(private afs: AngularFirestore, private db: AngularFireDatabase) {}
  
   // Get Chassis by Brand
   selectBrand(searchedText: string): Observable<Chassis[]> {
    return this.afs.collection("chassis", ref => ref.where("brand", "==", searchedText).orderBy("name", "asc")).valueChanges() as Observable<Chassis[]>;
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




}
