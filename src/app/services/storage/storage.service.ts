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
      return from(this.store.collection<WarehouseModel>('Warehouses').ref.where('userCanRead', "array-contains", user!.uid).get())
    }))
  }

  public getWarehouseByRef(ref: DocumentReference<WarehouseModel>) {
    return this.store.doc<WarehouseModel>(ref.path).valueChanges()
  }

  public getCategoriesByRef(refs: DocumentReference<CategoryModel>[]) {
    return combineLatest(refs.map(ref => this.store.doc<CategoryModel>(ref.path).valueChanges()))
  }

  public getManufacturerByRef(ref: DocumentReference<ManufacturerModel>) {
    return this.store.doc<CategoryModel>(ref.path).valueChanges()
  }

  public getAllItems() {
    return this.getAllWarehouses().pipe(
      mergeMap(warehouses => {
        return combineLatest(warehouses.docs.map(warehouse => { return from(this.store.collection<ItemModel>('Items').ref.where('warehouse', '==', warehouse.ref).get()) }))
      }),
      mergeMap(itemsByWarehouse => {
        return combineLatest(itemsByWarehouse.flatMap(items => items.docs.map(item => item.data()))
          .map(item => {
            return zip(of(item), 
            this.getWarehouseByRef(item.warehouse), 
            item.category ? this.getCategoriesByRef(item.category) : of(undefined), 
            item.manufacturer ?  this.getManufacturerByRef(item.manufacturer) : of(undefined))
          }))
      }))
  }
}

