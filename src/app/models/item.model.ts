import { DocumentReference } from 'firebase/firestore'
import { CategoryModel } from './category.model';
import { ManufacturerModel } from './manufacturer.model';
import { WarehouseModel } from './warehouse.model';

export interface ItemModel {
    name: string,
    summary: string,
    purchase_price: number,
    quantity: number,
    selling_price: number,
    category: DocumentReference<CategoryModel>,
    manufacturer: DocumentReference<ManufacturerModel>,
    warehouse: DocumentReference<WarehouseModel>
    upc: string,
    sku: string,
}