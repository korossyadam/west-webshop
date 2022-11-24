import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private afs: AngularFirestore, private db: AngularFireDatabase) { }

  // Upload Data
  async addOrder(order: Order): Promise<string> {
    const uid = this.afs.createId();
    await this.afs.collection('orders').doc(uid).set(order);
    return uid;
  }
}
