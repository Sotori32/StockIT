import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { combineLatest, filter, first, mergeMap } from 'rxjs';
import { ItemCollectionPath, ItemModel } from 'src/app/models/item.model';
import { OrganizationCollectionPath, OrganizationModel } from 'src/app/models/organization.model';
import { WarehouseCollectionPath, WarehouseDisplayModel, WarehouseModel } from 'src/app/models/warehouse.model';
import { OrganizationService } from '../organization/organization.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  
  constructor(private auth: AngularFireAuth,private organizationService: OrganizationService, private store: AngularFirestore) { }
  
  public getAllWarehousesInOrganization() {
    return this.auth.user.pipe(filter(user => !!user), mergeMap(user => {
      return this.store.collection<WarehouseModel>(WarehouseCollectionPath).ref.where('userCanRead', 'array-contains', user!.uid).get()
    }))
  }
  
  public getAllWarehousesInOrganizationSync() {
    return this.auth.user.pipe(filter(user => !!user), mergeMap(user => {
      return this.store.collection<WarehouseModel>(WarehouseCollectionPath, ref => ref.where('userCanRead', 'array-contains', user!.uid)).snapshotChanges()
    }))
  }

  public getAllWriteableWarehouses() {
    return this.auth.user.pipe(filter(user => !!user), mergeMap(user => {
      return this.store.collection<WarehouseModel>(WarehouseCollectionPath).ref.where('userCanWrite', 'array-contains', user!.uid).get()
    }))
  }

  public addWarehouse(warehouse: WarehouseModel) {
    this.auth.user.pipe(filter(user => !!user), first()).subscribe(user => {
      const userId = user!.uid;
      warehouse.userCanRead.push(userId);
      warehouse.userCanRead = [...new Set(warehouse.userCanRead)];
      warehouse.userCanWrite.push(userId);
      warehouse.userCanWrite = [...new Set(warehouse.userCanWrite)];
      this.store.collection<WarehouseModel>(WarehouseCollectionPath).add(warehouse).then(warehouseRef => {
        this.organizationService.getUserOrganization().pipe(first()).subscribe(org => {
          this.store.doc<OrganizationModel>(org.ref).update({warehouses: [...org.data().warehouses, warehouseRef]})
        })
      })
    })
  }

  public deleteWarehouse(warehouse: WarehouseDisplayModel) {
    const wref = this.store.doc<WarehouseModel>(WarehouseCollectionPath + "/" + warehouse.id).ref;
    this.store.doc<WarehouseModel>(WarehouseCollectionPath + "/" + warehouse.id).delete().then(() => {
      this.organizationService.getUserOrganization().pipe(first()).subscribe(org => {
        this.store.doc<OrganizationModel>(org.ref).update({warehouses: org.data().warehouses.filter(w => w.id !== warehouse.id)})
      })
      this.store.collection<ItemModel>(ItemCollectionPath, ref => ref.where('warehouse', '==', wref)).get().pipe(first()).subscribe(items => {
        items.docs.map(item => {
          if (item.data().warehouse == wref) {
            this.store.doc<ItemModel>(item.ref).delete();
          }
        })
      })
    })
  }
  
  public editWarehouse(id: string, warehouse: WarehouseModel) {
    this.store.doc<WarehouseModel>(WarehouseCollectionPath + "/" + id).update(warehouse)
  }

  public addUserToWarehouse(ref: DocumentReference<WarehouseModel>, uid: string, isAddingToUserCanRead: boolean) {
    this.store.doc<WarehouseModel>(ref).get().pipe(first()).subscribe(w => {
      if (isAddingToUserCanRead) {
        this.store.doc<WarehouseModel>(ref).update({userCanRead: [...w.data()?.userCanRead!, uid]})
      } else {
        this.store.doc<WarehouseModel>(ref).update({userCanWrite: [...w.data()?.userCanWrite!, uid]})
      }
    })
  }
}
