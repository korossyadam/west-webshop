import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Battery } from '../models/products/battery.model';

@Injectable({
   providedIn: 'root'
})
export class BatteryService {

   constructor(private afs: AngularFirestore, private db: AngularFireDatabase) { }

   // Search for batteries
   search(voltage: number, pole: number, capacities: string[]): Observable<Battery[]> {
      return this.afs.collection('batteries', ref => {
         let query: CollectionReference | Query = ref;

         // Get acceptable categories for Capacity
         let capacityCategories: string[] = [];
         for(let i = 0; i < capacities.length; i++){
            capacityCategories = this.getCapacityCategories(capacityCategories, capacities[i]);
         }

         query = query
            .where('voltage', '==', voltage)
            .where('pole', '==', pole)
            .where('capacityCategories', 'array-contains-any', capacityCategories);
         //query = query.orderBy('name', 'asc');
         return query;
      }).valueChanges() as Observable<Battery[]>;
   }

   // Upload Data
   async addBattery(battery: Battery, id?: string): Promise<string> {
      const uid = id ? id : this.afs.createId();
      battery.capacityCategory = this.setCategoryCapacity(battery.capacity, battery.starterCurrent);
      await this.afs.collection('batteries').doc(uid).set(battery);
      return uid;
   }

   // Get Capacity categories
   getCapacityCategories(categories: string[], capacity: string): string[] {
      if(capacity == '0-20') {
         categories.push('a');
      } else if(capacity == '20-40') {
         categories.push('b');
      } else if(capacity == '40-60') {
         categories.push('c');
      } else if(capacity == '60-80') {
         categories.push('d');
      } else if(capacity == '80-100') {
         categories.push('e');
      }

      return categories;
   }

   // Set Category (FOR UPLOADING)
   setCategoryCapacity(capacity: number, starter: number): string[] {
      var category: string[] = [];

      // Capacity
      if(capacity > 0 && capacity <= 20) {
         category.push('a')
      }
      if(capacity >= 20 && capacity <= 40) {
         category.push('b')
      }
      if(capacity >= 40 && capacity <= 60) {
         category.push('c')
      }
      if(capacity >= 60 && capacity <= 80) {
         category.push('d')
      }
      if(capacity >= 80 && capacity <= 100) {
         category.push('e')
      }

      return category;
   }
}
