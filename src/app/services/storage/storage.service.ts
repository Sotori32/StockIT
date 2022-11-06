import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { userConverter, UserModel } from 'src/app/models/user.model';
import { WarehouseModel } from 'src/app/models/warehouse.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(public store: AngularFirestore, private auth: AngularFireAuth) { }

  public getAllWarehouses() {
    return this.auth.user.pipe(map(user => {
      return this.store.collection<WarehouseModel>('Warehouses').ref.where(user!.uid, 'in', 'userCanRead').get()
    }))
  }
}
