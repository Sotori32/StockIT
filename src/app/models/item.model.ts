import { DocumentData, DocumentReference, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from 'firebase/firestore'
import { CategoryModel } from './category.model';
import { ManufacturerModel } from './manufacturer.model';
import { WarehouseModel } from './warehouse.model';

export interface ItemModel {
    name: string,
    summary: string,
    purchasePrice: number,
    quantity: number,
    sellingPrice: number,
    category: DocumentReference<CategoryModel>,
    manufacturer: DocumentReference<ManufacturerModel>,
    warehouse: DocumentReference<WarehouseModel>
    upc: string,
    sku: string,
}


export const itemConverter: FirestoreDataConverter<ItemModel> = {
    toFirestore: function (item: WithFieldValue<ItemModel>): DocumentData {
        return { name: item.name, summary: item.summary, purchasePrice: item.purchasePrice, 
            category: item.category, manufacturer: item.manufacturer, quantity: item.quantity, 
            sellingPrice: item.sellingPrice, sku: item.sku, upc: item.upc, warehouse: item.warehouse }
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): ItemModel {
        const data = snapshot.data(options);
        return { name: data['name'], summary: data['summary'], purchasePrice: data['purchasePrice'],
            quantity: data['quantity'], sellingPrice: data['sellingPrice'], category: data['category'], 
            manufacturer: data['manufacturer'], sku: data['sku'], upc: data['upc'], warehouse: data['warehouse'] }
    }
}