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

  public addItem(
    name: string,
    sku: string,
    upc: string,
    summary: string | undefined,
    category: DocumentReference<CategoryModel>[],
    manufacturer: DocumentReference<ManufacturerModel> | undefined,
    warehouse: DocumentReference<WarehouseModel>,
    purchasePrice: number,
    sellingPrice: number,
    quantity: number) {
    this.store.collection<ItemModel>(ItemCollectionPath).add(
      { name, 
        category,
        manufacturer: manufacturer ?? undefined,
        purchasePrice, 
        quantity, 
        sellingPrice, 
        sku, 
        summary: summary ?? undefined, 
        upc, 
        warehouse 
      })
  }
}
