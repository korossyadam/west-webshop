import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { deleteField } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DevService {

  constructor(private afs: AngularFirestore, private db: AngularFireDatabase, private afbs: AngularFireStorage) { }

  /**
   * Each car model stores how many products are avabile to themselves from each category
   * This fu
   * @param line 
   */
  modifyProductQuantities(line: string) {
    let parts: string[] = line.split(';');
    let index = parts[0];

    let fields: string[] = [];
    for (let i = 1; i < parts.length; i++) {
       fields.push(parts[i].split(' ')[0] + '*' + parts[i].split(' ')[1]);
    }
    this.afs.collection("cars", ref => ref.where('carIndex', '==', parseInt(index))).get().subscribe(data => {
       let id = data.docs[0].id;
       this.afs.collection('cars').doc(id).update({
          productLengths: fields,
          productLenghts: deleteField(),
       }).then(res => console.log(id + ' finished'));
    });
 }
}
