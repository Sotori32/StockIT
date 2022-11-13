import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { CategoryModel } from 'src/app/models/category.model';
import { ItemModel, ItemModelPath as ItemCollectionPath } from 'src/app/models/item.model';
import { ManufacturerModel } from 'src/app/models/manufacturer.model';
import { WarehouseModel } from 'src/app/models/warehouse.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private store: AngularFirestore) { }

  public addItem(item: ItemModel) {
    this.store.collection<ItemModel>(ItemCollectionPath).add(item)
  }

  public deleteItem(id: string){
    this.store.doc<ItemModel>(ItemCollectionPath + "/" + id).delete()
  }

  public editItem(id: string, item: ItemModel) {
    this.store.doc<ItemModel>(ItemCollectionPath + "/" + id).update(item)
  }  
}
