import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { User } from 'firebase/auth';
import { combineLatest, concat, concatMap, filter, from, map, mergeMap, of, switchMap, zip } from 'rxjs';
import { CategoryModel } from 'src/app/models/category.model';
import { ItemModel } from 'src/app/models/item.model';
import { ManufacturerModel } from 'src/app/models/manufacturer.model';
import { userConverter, UserModel } from 'src/app/models/user.model';
import { warehouseConverter, WarehouseModel } from 'src/app/models/warehouse.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private store: AngularFirestore, private auth: AngularFireAuth) { }

  public getAllWarehouses() {
    return this.auth.user.pipe(filter((user) => !!user), mergeMap(user => {
      return this.store.collection<WarehouseModel>('Warehouses', ref => ref.where('userCanRead', "array-contains", user!.uid)).snapshotChanges()
    }))
  }

  public getWarehouseByRef(ref: DocumentReference<WarehouseModel>) {
    return this.store.doc<WarehouseModel>(ref.path).get()
  }

  public getCategoriesByRef(refs: DocumentReference<CategoryModel>[]) {
    if (refs.length === 0) {
      return of([])
    }
    return combineLatest(refs.map(ref => this.store.doc<CategoryModel>(ref.path).get()))
  }

  public getManufacturerByRef(ref: DocumentReference<ManufacturerModel>) {
    return this.store.doc<ManufacturerModel>(ref.path).get()
  }

  public getAllItems() {
    return this.getAllWarehouses().pipe(
      mergeMap(warehouses => {
        return combineLatest(warehouses.map(warehouse => { return from(this.store.collection<ItemModel>('Items', ref => ref.where('warehouse', '==', warehouse.payload.doc.ref)).snapshotChanges()) }))
      }),
      mergeMap(itemsByWarehouse => {
        return combineLatest(itemsByWarehouse.flatMap(items => items.map(item => {return {data: item.payload.doc.data(), id: item.payload.doc.id}}))
          .map(item => {
            return zip(of(item), 
            this.getWarehouseByRef(item.data.warehouse), 
            this.getCategoriesByRef(item.data.category), 
            item.data.manufacturer ?  this.getManufacturerByRef(item.data.manufacturer) : of(undefined))
          }))
      }))
  }
}

